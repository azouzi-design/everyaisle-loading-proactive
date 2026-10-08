# SmartMeals Loading Animation

Production reference for the SmartMeals (powered by Every Aisle) loading screen.

**Live:** https://everyaisle-loading-proactive.vercel.app
**Design:** [Figma — Every Aisle Branding, node 581:807](https://www.figma.com/design/Yg71Hf5LrpNcHDU2szE1h6/Every-Aisle-%E2%80%94-Branding?node-id=581-807)

```bash
npm install
npm run dev   # http://localhost:3000
```

## Where things live

```
src/components/smartmeals-loading/
  config.ts              ← copy, timing, geometry, direction (edit here)
  useStepTimeline.ts     ← looping step timeline (requestAnimationFrame)
  LoadingRing.tsx        ← outer ring + dotted track + label
  StepLabel.tsx/.css     ← shared-axis-Z label transition
  BrandPanel.tsx/.css    ← navy header with depth
  LoadingScreen.tsx      ← full screen composition
src/components/PhoneFrame.tsx   ← demo-only device chrome (don't ship)
src/components/BrandDemo.tsx    ← demo-only page shell + color picker state
src/components/ColorPicker.tsx  ← demo-only brand color picker
public/figma/                   ← SVG assets exported from Figma
```

To drop it into an app, copy `smartmeals-loading/` and the two logo SVGs, then render
`<LoadingScreen />`, or just `<LoadingRing />` on its own. `LoadingRing` accepts `steps`
and `timing` props, so the copy and pacing can change without touching the component.

## Motion spec

Platform-agnostic, so it can be rebuilt natively (SwiftUI, Compose, Lottie, …).

### Loop

| Phase  | Duration | What happens                                                         |
| ------ | -------- | -------------------------------------------------------------------- |
| Fill   | 1600 ms  | New label enters; ring sweeps ⅓ of the circle, ease-in-out cubic     |
| Hold   | 800 ms   | Ring rests                                                           |
| Reset  | 500 ms   | Navy arc fades to 0, dots return to grey; first label comes back    |

Fill + hold runs once per step (×3), then reset. Total cycle: **7.7 s**, repeats forever.

- **Direction:** clockwise, starting at 12 o'clock (`DIRECTION` in `config.ts`).
- **Outer ring:** 334 pt diameter, 7.34 pt stroke, butt caps. Empty `#E2E5EA`, filled `--brand`.
- **Dotted track:** 22 dots, 5 pt diameter, on a 147 pt radius. Each dot turns from `#CFD4DC`
  to `--brand` (300 ms ease-out) as the arc passes its angle, so dots and arc fill together.
- **Step checkmarks:** the dot nearest the middle of each step's arc is swapped for the
  20 pt checkmark icon (Figma node 582:898, fill `--brand`, white tick) when the arc reaches it.
  The dot shrinks out (300 ms) while the check pops in (500 ms, `cubic-bezier(0.34, 1.56, 0.64, 1)`,
  scale 0 → 1 with overshoot). Checks clear with the dots on reset.
- **Reduced motion:** the ring jumps to each third and labels crossfade without scaling.

### Label — Material shared axis Z

Duration 500 ms, easing `cubic-bezier(0.2, 0, 0, 1)`.

| Label    | Opacity                          | Scale       |
| -------- | -------------------------------- | ----------- |
| Outgoing | 1 → 0 over first 30 % (150 ms), linear | 1 → 1.1 |
| Incoming | 0 → 1 over last 70 % (350 ms, 150 ms delay) | 0.8 → 1 |

Type: Inter Medium 16 / -0.5 tracking, `#102A50`.

### Steps

1. Logging you into SmartMeals
2. Linking to your HARPS loyalty
3. Personalizing for you

## Theming

One CSS variable, `--brand`, colors the ring fill, the dots and the brand panel
(default `#102A50`). Set it on any ancestor:

```tsx
<div style={{ "--brand": "#178FAE" }}><LoadingScreen /></div>
```

It's registered with `@property` in `globals.css`, so changing it animates (450 ms).
Label text stays navy `#102A50` regardless of theme. The demo's color picker
(`ColorPicker.tsx`, Figma node 582:910) offers Navy, Bright aqua `#61C5E5`,
Creator teal `#178FAE` and Citrus gold `#F4B642`.

## Ring depth

Lit from the top to match the brand panel (see `LoadingRing.module.css`):

- **Track:** a shallow groove, `#E2E5EA` darkened 8 % toward navy at the top → lightened 45 % at the bottom
- **Fill:** brand +0.08 OKLCH lightness at the top → brand (45 %) → brand −0.10 at the bottom
- **Rim highlight:** 1.5 pt white line along the fill's outer edge, 45 % opacity at the top fading to 0 by 60 % height
- **Shadow:** fill and checkmarks drop a 0 / 2 / 2.5 blur shadow in `--brand` at 35 % opacity
- **Inner surface:** a wedge inside the ring, `--brand` at 3 % opacity, sweeping in lockstep with the arc and fading with it on reset

## Brand panel depth

Layered on `--brand` (see `BrandPanel.module.css`):

- Vertical gradient: brand +0.05 OKLCH lightness → brand (45 %) → brand −0.12 lightness
- Soft white spotlight behind the logo (9 % opacity radial)
- Inset top rim highlight (1 pt, 18 % white) and inner top glow
- Inset bottom shade (45 % black) and a faint outer drop shadow

## Stack

Next.js (App Router), React, TypeScript, Tailwind CSS v4, deployed on Vercel.
Pushes to `main` deploy to production; other branches get preview URLs.
