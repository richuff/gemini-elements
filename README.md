# Gemini Elements (Gemini 元素模型选择器)

> ⚛ A futuristic Periodic Table Model Selector plugin for Google Antigravity, featuring seamless element matching, 3-stage magnetic energy sliders, and completely silent model switching.

---

## 🌟 Key Features

1. **Full Periodic Table of Elements (1-118)**
   - Complete 7-period × 18-group scientific periodic table grid including Element 118 (**Oganesson**, `Og`, `鿫`).
   - Clean, luminous Light-Tech design with adaptive widescreen HUD view.

2. **Gemini 4 Element Name Mapping**
   - Automatically maps Antigravity API models to their corresponding chemical elements:
     - `Gemini 4 Neon` ➔ **[10 Ne 氖]**
     - `Gemini 4 Carbon` ➔ **[6 C 碳]**
     - `Gemini 4 Argon` ➔ **[18 Ar 氩]**
     - `Gemini 4 Hydrogen` ➔ **[1 H 氢]**
   - **Glow & State Indicators**: Available models glow with a cyan pulse and a `[Available]` badge; unauthorized models show `[🔒 No Permission]`; unreleased elements show `[Unreleased]`.

3. **Compact 3-Stage Magnetic Energy Slider**
   - Built for models with reasoning effort tiers (such as `Gemini 3.8 Flash`).
   - **Minimalist Design**: Clean slider track with live level badge displayed on the right (`[ 🟢 Medium ]`, `[ ⚡ High ]`, `[ ⚪ Low ]`).
   - **Magnetic Auto-Snap**: Release to automatically drop/snap down to the target tier ($0\% \sim 45\% \rightarrow \text{Low}$, $45\% \sim 88\% \rightarrow \text{Medium}$, $\ge 88\% \rightarrow \text{High}$). Clickable notch ticks and labels for one-tap jumping.

4. **Collapsible "Other Models" Tray**
   - Neatly organizes models not named after chemical elements (Claude 3.7/4.6 Sonnet, Opus, GPT-OSS 120B) at the bottom.
   - Smooth accordion expand/collapse transition without visual clutter.

5. **Silent CDP Model Switching**
   - Background model switching via Chrome DevTools Protocol without intrusive native menu popups flashing on screen.
   - Instant bottom bar trigger button synchronization.

---

## 📁 Repository Structure

```
gemini-elements/
├── assets/
│   └── logo.svg                 # Plugin logo
├── sidecars/
│   └── periodic-selector/
│       ├── main.mjs             # CDP daemon & injector
│       ├── periodic_ui.js       # Periodic UI, styles & slider logic
│       └── sidecar.json         # Sidecar descriptor
├── skills/
│   └── gemini-elements/
│       └── SKILL.md             # Antigravity skill description
├── plugin.json                  # Antigravity plugin manifest
├── README.md                    # English documentation
├── README_zh.md                 # Chinese documentation
├── LICENSE                      # MIT License
└── start-sidecar.cmd            # Windows quick-start script
```

---

## 📄 License

[MIT License](LICENSE) © 2026 richuff
