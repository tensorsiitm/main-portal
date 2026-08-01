# Tensors Website — Project Guide

This repo is the redesign of the **Tensors (IIT Madras)** website (`tensors.in`).

## ALWAYS use these skills for this project

Before writing, editing, or styling **any** page, component, or copy in this repo,
you MUST consult these skills every session:

1. **`tensors-website`** (project skill in `.claude/skills/tensors-website/`) —
   the source of truth for brand colors, typography, the locked section order,
   team vertical names, and real project/content lists. Read it first, always.
2. **`frontend-design`** — for aesthetic quality, typography pairing, motion, and
   avoiding a templated look.

Reference site for the visual style is **https://27n.gg/** (dark theme, bold type,
confident spacing, parallax, count-up stats, horizontal sliders, grayscale→color
logo strip). Do not drift from this direction without the user asking.

## Tech stack

- Static site: plain `index.html` + `css/style.css` + `js/main.js` (no build step).
- Animation libs via CDN: **GSAP + ScrollTrigger** (scroll animation) and
  **Lenis** (smooth scroll). Keep these; don't swap frameworks without asking.
- Fonts: Clash Display (display) + General Sans (body) via Fontshare.

## Assets

- `assets/images/` — photos (hero, moments, projects). `assets/logos/` — partner
  logos. `assets/fonts/` — self-hosted fonts if added later.
- Real photos/logos/team names are **pending** — the user will supply them.
  Until then use the built-in CSS placeholders (`.ph` blocks) so nothing 404s.
  Every placeholder is labelled so it's obvious what real asset replaces it.

## Running the site

No build step. Open `index.html` directly, or serve the folder:

```bash
# from the project root
python -m http.server 5173      # then open http://localhost:5173
```

## Conventions

- Respect the locked section order in the `tensors-website` skill.
- Use the design tokens in `:root` (css/style.css) — never hardcode brand colors.
- Keep motion subtle and honor `prefers-reduced-motion`.
- Mobile: stack all grids to a single column; keep stat numbers large and centered.
