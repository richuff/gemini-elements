#!/usr/bin/env node
/**
 * main.mjs — Gemini 元素周期表模型选择器 Sidecar 守护进程
 * 
 * 机制：
 *   1. 读取 %APPDATA%\Antigravity\DevToolsActivePort 获取本地 CDP 调试端口
 *   2. 建立与 Antigravity 桌面端主页面的 WebSocket 连接
 *   3. 注入 periodic_ui.js 渲染元素周期表与模型选择交互
 *   4. 心跳保活与自动重连（会话刷新、页面跳转时自动重新注入）
 */

import { readFileSync, existsSync } from 'node:fs';
import http from 'node:http';
import net from 'node:net';
import { homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UI_SCRIPT_PATH = path.join(__dirname, 'periodic_ui.js');

const LOG = (...args) => console.log('[gemini-elements-sidecar]', ...args);

// 读取 DevTools 端口文件
function getDevToolsPort() {
  const home = homedir();
  let portFile;
  if (process.platform === 'win32') {
    const appdata = process.env.APPDATA || path.join(home, 'AppData', 'Roaming');
    portFile = path.join(appdata, 'Antigravity', 'DevToolsActivePort');
  } else if (process.platform === 'darwin') {
    portFile = path.join(home, 'Library', 'Application Support', 'Antigravity', 'DevToolsActivePort');
  } else {
    portFile = path.join(home, '.config', 'Antigravity', 'DevToolsActivePort');
  }

  if (!existsSync(portFile)) return null;
  try {
    const content = readFileSync(portFile, 'utf8').trim();
    const port = Number(content.split(/\r?\n/)[0]);
    return Number.isInteger(port) && port > 0 ? port : null;
  } catch (err) {
    return null;
  }
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, { timeout: 3000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// 单实例端口互斥锁（避免重复启动多个守护进程）
function acquireSingleInstanceLock(port = 58118) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        LOG(`[Mutex] Another instance of Gemini Elements Sidecar is already running on port ${port}. Exiting.`);
        process.exit(0);
      }
      resolve(false);
    });
    server.once('listening', () => {
      LOG(`[Mutex] Acquired single-instance lock on port ${port}.`);
      resolve(server);
    });
    server.listen(port, '127.0.0.1');
  });
}

class ElementsDaemon {
  constructor() {
    this.ws = null;
    this.currentPort = null;
    this.injected = false;
    this.pollInterval = null;
  }

  async start() {
    await acquireSingleInstanceLock(58118);
    LOG('Starting Gemini Elements Periodic Table Sidecar Daemon...');
    this.loop();
  }

  async loop() {
    while (true) {
      try {
        const port = getDevToolsPort();
        if (!port) {
          // LOG('Waiting for Antigravity DevToolsActivePort...');
          await new Promise(r => setTimeout(r, 2500));
          continue;
        }

        const targets = await fetchJson(`http://127.0.0.1:${port}/json/list`);
        const mainTarget = targets.find(t => 
          t.type === 'page' && 
          !t.url?.startsWith('data:') && 
          (t.url?.includes('127.0.0.1') || (t.title && (t.title.includes('Antigravity') || t.title.includes('Gemini'))))
        );

        if (!mainTarget || !mainTarget.webSocketDebuggerUrl) {
          await new Promise(r => setTimeout(r, 2000));
          continue;
        }

        await this.connectAndInject(mainTarget.webSocketDebuggerUrl);
      } catch (err) {
        LOG('Error in loop, retrying in 3s:', err.message);
      }
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  connectAndInject(wsUrl) {
    return new Promise((resolve) => {
      LOG('Connecting to Antigravity UI WebSocket:', wsUrl);
      const ws = new WebSocket(wsUrl);
      let closed = false;
      let healthTimer = null;

      const injectScript = () => {
        try {
          const uiCode = readFileSync(UI_SCRIPT_PATH, 'utf8');
          ws.send(JSON.stringify({
            id: Date.now(),
            method: 'Runtime.evaluate',
            params: { expression: uiCode, userGesture: true }
          }));
        } catch (e) {
          LOG('Failed to read or send UI script:', e.message);
        }
      };

      ws.onopen = () => {
        LOG('WebSocket connected. Injecting periodic_ui.js...');
        injectScript();

        // 启用 Page 监听以在 reload 时再次注入
        ws.send(JSON.stringify({ id: 2, method: 'Page.enable' }));

        // 动态健康自愈：每 2 秒检测一次 SPA 路由切换与组件重挂载
        healthTimer = setInterval(() => {
          if (closed) {
            clearInterval(healthTimer);
            return;
          }
          try {
            ws.send(JSON.stringify({
              id: 9999,
              method: 'Runtime.evaluate',
              params: {
                expression: `(() => {
                  const footer = document.querySelector('.agy-composer-footer');
                  const btn = document.getElementById('agy-custom-model-trigger');
                  const overlay = document.getElementById('agy-periodic-modal-overlay');
                  if (footer && (!btn || !footer.contains(btn) || !overlay)) {
                    return 'reinject';
                  }
                  return 'ok';
                })()`,
                returnByValue: true
              }
            }));
          } catch (_) {}
        }, 2000);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.id === 1) {
            LOG('Injection evaluation completed:', msg.result?.result?.value || 'OK');
          }
          if (msg.id === 9999 && msg.result?.result?.value === 'reinject') {
            LOG('DOM changed or trigger missing in current conversation, re-injecting periodic_ui.js...');
            injectScript();
          }
          if (msg.method === 'Page.loadEventFired') {
            LOG('Page reloaded, re-injecting...');
            injectScript();
          }
        } catch (e) {}
      };

      ws.onerror = (e) => {
        LOG('WebSocket error:', e.message || 'error');
        if (healthTimer) clearInterval(healthTimer);
        if (!closed) { closed = true; resolve(); }
      };

      ws.onclose = () => {
        LOG('WebSocket connection closed.');
        if (healthTimer) clearInterval(healthTimer);
        if (!closed) { closed = true; resolve(); }
      };
    });
  }
}

const daemon = new ElementsDaemon();
daemon.start();
