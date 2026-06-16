# Light-theme restyle mapping

These lesson components now render INSIDE a continuous white reading panel.
Convert each from the old dark theme to a light theme. Change ONLY colors/
backgrounds/borders — keep all layout, props, logic, JSX structure identical.
Every text color must be readable on white (WCAG AA).

## Background / surface
- card surface `#0d0d0d`, `#0a0a0a` → `#ffffff`
- inset / code surface `#080808`, `#111`, `#0a0a0a` → `#f6f6f7`
- subtle alt row `#0a0a0a` (table headers) → `#fafafa`

## Borders / dividers
- `#1e1e1e`, `#1a1a1a`, `#222`, `#151515`, `#111` → `#e4e4e7`
- header underline / divider → `#ececef`

## Text
- primary `#f0f0f0` `#f5f5f5` `#e8e8e8` `#e0e0e0` `#ddd` → `#18181b`
- secondary `#ccc` `#bbb` `#aaa` → `#3f3f46`
- muted `#888` `#999` → `#52525b`
- labels `#555` `#666` `#777` → `#6b7280`

## Accents — DARKEN for contrast on white (labels, headings, icons, borders)
- lime `#b8ff00` → `#4d7c0f`
- blue `#60a5fa` → `#2563eb`
- purple `#cc66ff` → `#9333ea`
- gold `#f0c000` → `#b45309`
- green `#36d399` → `#059669`
- orange `#ff6b35` → `#ea580c`
- red `#ef4444` → `#dc2626`

## Accent tint fills
- patterns like `${c}18` `${c}14` `${c}10` `#b8ff0010` stay as light tints — keep the
  formula but use the DARKENED accent hex as the base (e.g. `#4d7c0f14`). On white a
  ~8-14% tint reads as a soft colored highlight. Good.

## Buttons with a solid accent background
- keep the accent as the button background but use the DARKENED hex, with WHITE text
  (`#ffffff`). e.g. lime button → `background:#4d7c0f; color:#ffffff`.
- ghost/secondary buttons: `background:transparent; border:1px solid #d4d4d8; color:#3f3f46`.

## Code text inside code blocks
- mono code that was `#b8ff00` on `#080808` → `#166534` (dark green) on `#f6f6f7`.
- generic code text `#e8e8e8`/`#333` → `#1f2937`.

## Token chips (InteractiveTokenizer) and colored pills
- keep the multi-color palette but darken each to its mapped hex above so chips read on white.

Goal: one clean continuous white sheet with soft light cards — like GeeksforGeeks /
zyBooks. No pure-black surfaces, no low-contrast gray-on-dark text anywhere.
