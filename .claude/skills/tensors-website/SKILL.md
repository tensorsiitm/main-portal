---
name: tensors-website
description: Brand, content, and design guidelines for the Tensors (IIT Madras) website redesign. Use this whenever building, editing, or styling any page/component for the Tensors website, or writing copy for tensors.in. Reference site for visual style is https://27n.gg/ — dark theme, bold type, confident spacing, parallax and count-up stat animations. Always check this file before writing Tensors website code or content.
---

# Tensors Website Skill

Tensors is a student-run NGO-turned-tech-consultancy at IIT Madras. This site is
being rebuilt with **27n.gg (https://27n.gg/)** as the direct visual/style reference —
dark theme, bold big headlines, confident white space, parallax scroll, count-up
stats, horizontal sliders, grayscale-to-color logo strip.

Always design and write copy in that spirit: confident, modern, consultancy-grade,
not a typical "student club" site.

## Brand Colors

The theme is **dark green**, built around the actual Tensors logo green.

- Background: very dark green `#07120F` (alt `#0C1A16`, surface `#122622`)
- Primary text: white `#FFFFFF`
- Accent (primary): **Tensors logo green `#22A286`** (sampled from the logo)
- Accent (primary, light tint): `#2CBF9C` — hovers, highlights, eyebrow labels
- Accent (primary, deep): `#14614F` — depth/borders
- Accent (secondary): orange `#E8622C` — used sparingly for "placeholder/draft" flags

Use the logo green `#22A286` as the main CTA/accent color. Keep all greens in this
same hue family — do **not** drift toward bright mint/cyan or the old purple.
Orange is a small highlight only.

### Team vertical accents

Each vertical has its own muted accent, set once in `:root` and shared by both
themes (badges use white text, so the hue must stay mid-dark in dark mode too).
All three clear 4.5:1 against white:

- `--color-tenlink: #18806A` — brand green
- `--color-tensci:  #2E6F9E` — slate blue
- `--color-tenment: #8A6A3B` — warm ochre

These are the one sanctioned exception to the all-green rule above; the user
chose a distinguishable trio over three near-identical greens. Orange is **not**
a vertical color — it stays reserved for placeholder/draft flags.

## Typography & Layout Rules

- Big, bold sans-serif headlines (60-80px desktop hero)
- Clean sans-serif body text, generous line-height
- Small uppercase label tags before section titles for a techy feel
- Sticky/fixed header
- Generous space between sections — never cluttered
- Mobile: stack all grids to a single column, keep stat numbers large and centered

## Signature Design Elements (from 27n.gg)

- Numbers that count up from 0 on scroll (stats strip)
- Parallax on project/case-study images
- Horizontal scroll / slider for photo galleries and project cards
- Grayscale partner logos that turn to color on hover
- Quote cards with a circular photo (director messages, testimonials)
- Smooth fade/slide-in animations as sections enter viewport

## Site Structure (locked order)

1. Header — Home | About Us | Projects | Team | Tensors-Edu | Contact
2. Hero — "Tech Consultancy Born Out of IIT Madras" + CTA
3. About Us + Vision Statement
4. Stats strip (founded year, students reached, projects delivered, etc.)
5. Our Values (Learning, Mentorship, Social Impact, Skill Development)
6. Our Work / Projects — split into "Consultancy Work" and "Social Impact Work"
7. Photo / Moments slider
8. Our Team — three verticals (see below)
9. Social Events done by us
10. Our Collaborations (partner logo strip)
11. Message from Director (quote cards)
12. Footer — contact, socials, newsletter

## Team Verticals (current, confirmed names)

- **Tenlink** — PR & Corporate Relations. Client/NGO/corporate relationships,
  branding, outreach, funding. Also runs the Tensors Podcast and Social Campaigns,
  and drives visibility inside IIT-M.
- **Tensci** — Tech team. AI/ML, web development, manages all Tensors platforms.
  Leading this year's website revamp.
- **Tenment** — Exam & Mentorship. JEE mock tests, Olympiad, JoSAA counselling,
  plus the Tensors LMS and Career Guidance/Mentorship portal.

Spelling is **Tensci** (one `i`), title-case like Tenlink and Tenment.
Confirmed by the user on 2026-07-30; earlier drafts of this file said "Tenscii".

Do not use the older names (Elevate, Pulse, Catalyst, Ignite, Nova,
Mentorship Vertical as standalone) — those are outdated.

## Content Reference

Full locked copy for every section (hero text, about us, stats, project list,
team descriptions, director quotes, collaborations list) lives in the proposal
PDF already generated for this project. Pull exact wording from there rather
than rewriting from scratch, unless the user gives new copy.

## Known Real Projects (for the "Our Work" section)

Consultancy Work: AarogPlus Website, Idukki Ministry Website, Imprints Website,
Nav Sahyog App.

Social Impact Work: Decov, De-Cov Ideathon (with IMA Kerala), JoSAA Counselling,
Finance Workshop with Shaastra.

## Still Pending (don't invent these — ask the user)

- Real team member names/photos per vertical
- Event/moment photos for the slider
- Partner logo files
- Whether a full "Services" section is needed
