# Visual regression

Full-page screenshots of every public page plus each dialog and the ticket
and checkout flows, at desktop (1280×800) and mobile (390×844), against a
production build. The clock is pinned and lazy images are forced to load, so
runs are repeatable.

```bash
npm run build
npm run test:visual            # compare
npm run test:visual:update     # accept the current look as the baseline
```

Tests start `next start` on port 3123, so a dev server on 3000 doesn't interfere.

## Baselines

Screenshots differ per OS (fonts, anti-aliasing), so baselines live in
`__screenshots__/<platform>/`. Only `linux/` is committed, because CI runs on
Linux; other platforms are git-ignored and are yours to generate locally
before you change anything.

To create or refresh the Linux baselines, run the **Visual baselines** workflow
(Actions tab → Run workflow), download the `visual-baselines-linux` artifact
and commit its PNGs to `__screenshots__/linux/`. CI starts comparing as soon as
that folder exists.

## When baselines go stale on their own

Pages are pre-rendered at build time, so event content changes when a real
date passes (an event moves from upcoming to past, and its book page stops
being built). The ticket flow picks whichever event is bookable and skips when
none is. After such a date, refresh the baselines.
