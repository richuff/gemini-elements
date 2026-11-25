#!/usr/bin/env node
/**
 * main.mjs — Gemini 元素周期表模型选择器 Sidecar 守护进程
 * 
 * 机制：
 *   1. 读取 %APPDATA%\Antigravity\DevToolsActivePort 获取本地 CDP 调试端口
 *   2. 非阻塞多目标管理：动态追踪所有 Antigravity 会话窗口，永不卡死
 *   3. 等待系统与 React 界面完全加载就绪后再注入（避免过早注入导致组件丢失）
 *   4. 心跳保活与自愈监听：页面重载、SPA 路由跳转、DOM 刷新时智能自愈
 *   5. 互斥锁守护：避免单机重复运行
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

class PageSession {
  constructor(id, title, url, wsUrl) {
    this.id = id;
    this.title = title || '';
    this.url = url || '';
    this.wsUrl = wsUrl;
    this.ws = null;
    this.healthInterval = null;
    this.closed = false;
    this.isInjecting = false;
  }

  start() {
    LOG(`[Target ${this.id}] Connecting WebSocket to: ${this.url || this.title || this.wsUrl}`);
    const ws = new WebSocket(this.wsUrl);
    this.ws = ws;

    ws.onopen = () => {
      LOG(`[Target ${this.id}] WebSocket connected.`);
      ws.send(JSON.stringify({ id: 10, method: 'Page.enable' }));
      ws.send(JSON.stringify({ id: 11, method: 'Runtime.enable' }));

      // 启动自愈与状态轮询检测（每 1000ms 检查一次）
      this.healthInterval = setInterval(() => {
        this.checkAndInject();
      }, 1000);

      // 初次触发检查
      this.checkAndInject();
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.method === 'Page.frameNavigated' || msg.method === 'Page.loadEventFired') {
          LOG(`[Target ${this.id}] Page navigated or reloaded. Will wait for system ready...`);
        }
        if (msg.id === 9999 && msg.result?.result?.value) {
          const state = msg.result.result.value;
          this.handleState(state);
        }
      } catch (_) {}
    };

    ws.onerror = (err) => {
      LOG(`[Target ${this.id}] WebSocket error:`, err?.message || 'error');
      this.close();
    };

    ws.onclose = () => {
      LOG(`[Target ${this.id}] WebSocket closed.`);
      this.close();
    };
  }

  checkAndInject() {
    if (this.closed || !this.ws || this.ws.readyState !== WebSocket.OPEN || this.isInjecting) {
      return;
    }

    try {
      this.ws.send(JSON.stringify({
        id: 9999,
        method: 'Runtime.evaluate',
        params: {
          expression: `(() => {
            const ready = document.readyState === 'complete';
            const nativeTrigger = document.querySelector('button[data-testid="model-selector-trigger"]');
            const customBtn = document.getElementById('agy-custom-model-trigger');
            const overlay = document.getElementById('agy-periodic-modal-overlay');
            const observer = !!window.__agyElementsObserver;
            const isLatestVer = window.__agyElementsVer === '20261125-v2';

            // 1. 系统尚未加载完成（等待 React 挂载 composer 和原生模型按钮）
            if (!ready || !nativeTrigger) {
              return 'waiting_system_ready';
            }

            // 2. 系统加载完毕，但元素周期表按钮或模态框丢失或版本过期（冷启动完成、页面切换、组件刷新）
            if (!customBtn || !overlay || !observer || !isLatestVer) {
              return 'needs_injection';
            }

            // 3. 运行正常
            return 'ready';
          })()`,
          returnByValue: true
        }
      }));
    } catch (_) {}
  }

  handleState(state) {
    if (state === 'needs_injection') {
      LOG(`[Target ${this.id}] System is ready, injecting periodic_ui.js...`);
      this.doInject();
    } else if (state === 'waiting_system_ready') {
      // 系统尚未就绪，静默等待下一次检测
    }
  }

  doInject() {
    if (this.isInjecting || this.closed || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.isInjecting = true;
    try {
      const uiCode = readFileSync(UI_SCRIPT_PATH, 'utf8');
      this.ws.send(JSON.stringify({
        id: 8888,
        method: 'Runtime.evaluate',
        params: { expression: uiCode, userGesture: true }
      }));
      LOG(`[Target ${this.id}] Injected periodic_ui.js successfully.`);
    } catch (e) {
      LOG(`[Target ${this.id}] Failed to read or send UI script:`, e.message);
    } finally {
      setTimeout(() => {
        this.isInjecting = false;
      }, 500);
    }
  }

  close() {
    if (this.closed) return;
    this.closed = true;
    if (this.healthInterval) {
      clearInterval(this.healthInterval);
      this.healthInterval = null;
    }
    if (this.ws) {
      try { this.ws.close(); } catch (_) {}
      this.ws = null;
    }
  }
}

class ElementsDaemon {
  constructor() {
    this.sessions = new Map(); // targetId -> PageSession
  }

  async start() {
    await acquireSingleInstanceLock(58118);
    LOG('Starting Gemini Elements Periodic Table Sidecar Daemon (Multi-Target Ready)...');
    this.loop();
  }

  async loop() {
    while (true) {
      try {
        const port = getDevToolsPort();
        if (!port) {
          await new Promise(r => setTimeout(r, 2000));
          continue;
        }

        const targets = await fetchJson(`http://127.0.0.1:${port}/json/list`);
        const validTargets = targets.filter(t => 
          t.type === 'page' && 
          !t.url?.startsWith('data:') && 
          (t.url?.includes('127.0.0.1') || t.url?.includes('/c/') || (t.title && (t.title.includes('Antigravity') || t.title.includes('Gemini'))))
        );

        const currentTargetIds = new Set(validTargets.map(t => t.id));

        // 移除已经关闭的目标会话
        for (const [id, session] of this.sessions.entries()) {
          if (!currentTargetIds.has(id) || session.closed) {
            LOG(`[Target ${id}] Target gone or closed, cleaning up session.`);
            session.close();
            this.sessions.delete(id);
          }
        }

        // 添加新发现的目标会话
        for (const target of validTargets) {
          if (!this.sessions.has(target.id) && target.webSocketDebuggerUrl) {
            const session = new PageSession(target.id, target.title, target.url, target.webSocketDebuggerUrl);
            this.sessions.set(target.id, session);
            session.start();
          }
        }
      } catch (err) {
        LOG('Error in loop:', err.message);
      }
      await new Promise(r => setTimeout(r, 1500));
    }
  }
}

const daemon = new ElementsDaemon();
daemon.start();
