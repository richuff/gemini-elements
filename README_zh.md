# Gemini 元素模型选择器 (Gemini Elements)

> ⚡ 亮色轻科技风 · 化学元素周期表 + 镧系·锕系放射性元素族 + Gemini 4 元素全称映射 + 一体化胶囊滑轨能级选择器 + 纯净静默切换 Antigravity 插件。

---

## 🌟 核心特性

1. **化学元素周期表完整矩阵与放射性元素族**：
   - **全 118 种化学元素全库**：标准 7 周期 × 18 族科学周期表，完整收录 1 ~ 118 号全部元素（包含 118 号元素 **鿫** `Og`）。
   - **专属 f 区独立展区（完美 18 列垂直对齐）**：
     - **★ 镧系元素族**（57 `La` 镧 ~ 71 `Lu` 镥，共 15 种元素，含独有放射性核素 61 `Pm` 钷）。
     - **★★ 锕系放射性元素族**（89 `Ac` 锕 ~ 103 `Lr` 铹，全 15 种均为强放射性元素核素）。
   - **放射性元素专有核素徽章 `☢`**：为所有放射性元素（锕系全族、61 钷、43 锝、84 钋、85 砹、86 氡、87 钫、88 镭及 104~118 超重元素）标配琥珀金辐射徽章与发光微效。
   - **智能主表联动定位**：在主表第 6 周期第 3 族（`57-71 La* 镧系`）和第 7 周期第 3 族（`89-103 Ac* 锕系 ☢`）点击即可平滑滚动定位并高亮对应下属族区。
   - 采用大屏宽景 HUD 布局，通透纯净的亮色轻科技风（Light Tech），高对比度且视觉舒适。

2. **Gemini 4 按元素全称精确匹配**：
   - 依据 Antigravity 真实接口模型名称自动关联元素：
     - `Gemini 4 Neon` ➔ **[10 Ne 氖]**
     - `Gemini 4 Carbon` ➔ **[6 C 碳]**
     - `Gemini 4 Argon` ➔ **[18 Ar 氩]**
     - `Gemini 4 Hydrogen` ➔ **[1 H 氢]**
   - **状态指示一目了然**：已开放模型带有青翠呼吸辉光脉冲与 `可选` 标记；账号暂无权限模型标记为 `🔒无权限`；未发布元素显示 `未发布`。

3. **一体化胶囊滑轨能级选择器 (Low - Medium - High)**：
   - 针对具有思考能级（Effort Tier）的模型（如 `Gemini 3.8 Flash`），提供全新一代极简胶囊滑轨选择器。
   - **居中状态行**：左侧闪电图标、中央大字显示当前档位（`高` / `中` / `低`）与所属模型名称（`Gemini 3.8 Flash ›`）、右侧便捷关闭。
   - **28px 宽胶囊轨道与圆润滑块**：内嵌刻度微圆点，科技蓝渐变进度填充，纯白浮动悬浮球滑块。
   - **松开自动匹配下级档位**：支持平滑拖拽，未拉满阈值时松手自动回弹吸附至下级档位（$0\% \sim 45\% \rightarrow \text{Low}$，$45\% \sim 88\% \rightarrow \text{Medium}$，$\ge 88\% \rightarrow \text{High}$）。也可直接点击刻度或标签瞬间切换。

4. **抽屉式「其他可用模型」专属区**：
   - 最下方自动收纳非元素命名的现役主力模型（Claude 3.7/4.6 Sonnet、Opus、GPT-OSS 120B 等）。
   - 默认折叠收拢，带有平滑展开/收起过渡动效，不占用周期表视觉空间。

5. **纯净静默切换（零原生弹窗闪烁）**：
   - 后台通过 CDP 与 Base UI 菜单交互，在可视区域外静默完成选择，彻底杜绝左上角原生菜单闪烁问题。
   - 底部输入框模型按钮实时同步显示当前选择的模型与元素标志。

---

## 🚀 架构与技术原理

- **Sidecar 架构**：通过 `main.mjs` 读取 `%APPDATA%\Antigravity\DevToolsActivePort` 端口，以 WebSocket CDP 方式将 `periodic_ui.js` 注入到桌面端界面。
- **纯净 DOM 与样式隔离**：所有 UI 元素均采用 `agy-` 前缀，内嵌独立 Style Sheet 与动画关键帧。
- **动态状态观察者**：采用 `MutationObserver` 实时监听模型变动，保证任何时候模型变动都能毫秒级同步到 UI。

---

## 📁 目录结构

```
gemini-elements/
├── assets/
│   └── logo.svg                 # 插件图标
├── sidecars/
│   └── periodic-selector/
│       ├── main.mjs             # CDP 连接与自动注入守护进程
│       ├── periodic_ui.js       # 周期表选择器完整 UI 与交互逻辑
│       └── sidecar.json         # Sidecar 配置文件
├── skills/
│   └── gemini-elements/
│       └── SKILL.md             # Antigravity Skill 技能说明
├── plugin.json                  # 插件元信息配置
├── README.md                    # 英文说明文档
├── README_zh.md                 # 中文说明文档
├── LICENSE                      # MIT 开源协议
└── start-sidecar.cmd            # Windows 便捷启动脚本
```

---

## 📄 License

[MIT License](LICENSE) © 2026 richuff
