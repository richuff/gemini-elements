# Gemini Elements (Gemini 元素模型选择器)

> ⚡ A futuristic Periodic Table Model Selector plugin for Google Antigravity, featuring all 118 elements, dedicated Lanthanide & Actinide radioactive series, seamless element matching, capsule pill sliders, and completely silent model switching.

---

## 🌟 Key Features

1. **Full Periodic Table of Elements (1-118) & Radioactive Series**
   - **All 118 Chemical Elements**: Complete 7-period × 18-group scientific periodic table grid including Element 118 (**Oganesson**, `Og`, `鿫`).
   - **Dedicated f-block HUD Section (Perfect 18-Column Vertical Alignment)**:
     - **★ Lanthanides Series** (57 `La` ~ 71 `Lu`, 15 elements, including unique radioactive isotope 61 `Pm`).
     - **★★ Actinides Radioactive Series** (89 `Ac` ~ 103 `Lr`, all 15 elements are radioactive actinides).
   - **Radioactive Isotope Badge `☢`**: Prominent amber radiation badge for all radioactive elements (all Actinides, 61 `Pm`, 43 `Tc`, 84~86, 87~88, and 104~118 transactinides).
   - **Interactive Main-Table Anchoring**: Clicking `57-71 La*` (Period 6, Group 3) or `89-103 Ac* ☢` (Period 7, Group 3) smoothly scrolls and highlights the corresponding f-block series row.
   - Clean, luminous Light-Tech design with adaptive widescreen HUD view.

2. **Gemini 4 Element Name Mapping**
   - Automatically maps Antigravity API models to their corresponding chemical elements:
     - `Gemini 4 Neon` ➔ **[10 Ne 氖]**
     - `Gemini 4 Carbon` ➔ **[6 C 碳]**
     - `Gemini 4 Argon` ➔ **[18 Ar 氩]**
     - `Gemini 4 Hydrogen` ➔ **[1 H 氢]**
   - **Glow & State Indicators**: Available models glow with a cyan pulse and an `[Available]` badge; unauthorized models show `[🔒 No Permission]`; unreleased elements show `[Unreleased]`.

3. **Integrated Capsule Pill Slider Bar (Low - Medium - High)**
   - Built for models with reasoning effort tiers (such as `Gemini 3.8 Flash`).
   - **Centered Status Header**: Bold tier display (`高` / `中` / `低`), model subtitle (`Gemini 3.8 Flash ›`), lightning bolt icon, and quick close button.
   - **28px Capsule Track & Floating Thumb**: Embedded notch dots, smooth gradient fill, and tactile pure white circular thumb knob.
   - **Magnetic Auto-Snap**: Release to automatically drop/snap down to the target tier ($0\% \sim 45\% \rightarrow \text{Low}$, $45\% \sim 88\% \rightarrow \text{Medium}$, $\ge 88\% \rightarrow \text{High}$). Clickable notch ticks and labels for one-tap jumping.

4. **Collapsible "Other Models" Tray**
   - Neatly organizes models not named after chemical elements (Claude 3.7/4.6 Sonnet, Opus, GPT-OSS 120B) at the bottom.
   - Collapsed by default, with a smooth accordion expand/collapse transition without visual clutter.

5. **Silent CDP Model Switching**
   - Background model switching via Chrome DevTools Protocol without intrusive native menu popups flashing on screen.
   - Instant bottom bar trigger button synchronization.

---

## 🔄 Persistence & Auto-Recovery Across Restarts

1. **Session Lifecycle Hook (`hooks.json`)**: Configured with Antigravity's `SessionStart` event to automatically ensure the daemon is running whenever a conversation starts.
2. **Single-Instance Mutex (Port 58118)**: Named after Element 118 (Og), uses local loopback port `58118` to atomically guarantee only one daemon instance runs at any time without duplicate injections.
3. **Startup & Restart Persistence**: Background daemon runs lightweight in Windows (~18MB RAM, 0% CPU), automatically detecting new CDP debug ports and reconnecting across app restarts.

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
