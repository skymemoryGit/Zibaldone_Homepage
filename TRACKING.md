# TRACKING.md — zibaldone.ch

Living log of the project: what's done, what's next, what was decided and why.
Update this in the same commit as the change it describes.

---

## Status

| | |
|---|---|
| Phase | `v0.6` — wordmark fix, corner marks |
| Live at | not deployed yet |
| Repo | https://github.com/skymemoryGit/Zibaldone_Homepage |
| Last update | 2026-08-16 |

---

## Changelog

### v0.6 — 2026-08-16 — wordmark fix, corner marks
- **Wordmark tracking flipped from negative to positive** (`-.01em` →
  `.015em`), size bumped slightly. Instrument Serif italic at the old
  negative tracking read cramped/"schiacciato" (squashed) — owner flagged it
  same day it shipped. Positive tracking is correct for this font at display
  size; don't carry over the body-copy instinct of tightening italics.
- **Tagline simplified to one sentence, one line** on desktop/tablet: dropped
  the literal "(.ch = Switzerland)" gloss as redundant (the joke already
  lands from context) and kept only the flag as trailing punctuation —
  "...deserves a Swiss address. 🇨🇭". `max-width` opened from 46ch to 68ch so
  the full sentence fits on one line above ~560px; it still wraps naturally,
  not forcibly, on narrow phones.
- **Two corner marks added**: a hand-built rose (`assets/img/rose-mark.svg`,
  layered petal rings in shades of red, inspired by the "single rose on
  black" mood the owner referenced) bottom-right, and a fountain-pen-nib
  line mark (`assets/img/pen-mark.svg`, neutral ink tones, ties to the
  "zibaldone = notebook" idea) bottom-left. Both: `position: fixed` like
  `.bg`, low opacity (.16–.2), `pointer-events: none`, hidden under 760px.
  Original artwork, not reproductions of the reference photos — see
  CLAUDE.md § 6 for why this doesn't reopen the "no generated cover art"
  decision from v0.3.

### v0.5 — 2026-08-16 — real links, sort order, footer & type pass
- **Real URLs.** Pranzo McLaren Roulette, VPChess and Ravioli Milano now point
  at their `*.zibaldone.ch` subdomains and are `live`. TapVision stays
  `status: 'wip'` — still being built, no URL yet.
- **Newest-first sort.** `render()` now sorts the filtered list by `added`
  descending. A new site with a later date takes the front row automatically
  — no manual reordering, no sort control needed. `added` dates on the four
  own projects were spread out to reflect actual build order (Pranzo oldest →
  VPChess → Ravioli Milano → TapVision newest).
- **Default view is "Made by JYe", not "All".** Chip order changed to
  `mine, picks, all` — visitors land on the owner's own work first; "All" is
  last.
- **Tooltip copy trimmed to ~8–10 words** across every card — the old
  descriptions ran to 15–20 words and overflowed the tooltip's intent as a
  glance, not a read.
- **Wordmark reset in Instrument Serif italic**, with a one-line tagline
  underneath ("Not a blog, it's a zibaldone… because even chaos deserves a
  Swiss address. (.ch = Switzerland) 🇨🇭"). Both are explicit, deliberate
  exceptions to the "no tagline / Inter only" rules below — owner's call, not
  scope creep. Nothing else about the one-page layout changed.
- **Footer rebuilt.** LKs credit link removed (reverses the 2026-08-15
  decision to keep it). Now reads "Powered by Jc.Ye" + GitHub + LinkedIn,
  split across the row instead of four flat links in a line.

### v0.4 — 2026-08-15 — back to the grid, better materials
v0.3 was reverted in full. The multi-section editorial homepage was the wrong
answer to "make it look better" — the owner wants **this** layout, made finer.

Restored from v0.2: wordmark, search field, three collection chips, the compact
card grid, the hover tooltip, the four-link footer with the LKs credit. Same
data model (`SITES` / `COLLECTIONS`), same behaviour.

Upgraded, materials only:
- **Warm paper-white ink** `#F2EFE9` replaces the cold `#F5F5F7`, and every grey
  was re-warmed to match. This is most of the difference.
- **Champagne `#B9A77D` is now the only colour**, replacing both the system blue
  and the yellow star. Four uses total.
- **Every card carries a resting hairline**, so the grid reads as set rather
  than floating. Hover moves the hairline instead of adding a glow.
- Slightly larger radius and padding; the sheen on the wordmark now passes
  through champagne.

Fixed on the way through: an invalid declaration in the wordmark gradient, and
a duplicated `margin-top` on the footer that was cancelling `margin-top: auto`
and unpinning it on short pages.

### v0.3 — 2026-08-15 — digital maison *(reverted)*
Full editorial redesign: sticky masthead, hero, featured object, category
filters, about, closing CTA, colophon; serif display type; generated CSS cover
plates. Technically sound, wrong product. Rejected outright.

### v0.2 — 2026-08-15 — minimal redesign
Copy stripped to near zero, compact cards, caption moved into a floating hover
tooltip, footer reduced to four links. **This is the baseline the project
returned to.**

### v0.1 — 2026-08-15
First build: search, two collections, favourites, responsive grid.

---

## Backlog

### Next up
- [x] **Real URLs for the own projects.** Pranzo, VPChess and Ravioli Milano
      are `live` at their `*.zibaldone.ch` subdomains. TapVision still needs
      one — flip it to `'live'` when it ships.
- [ ] **Deploy.** GitHub Pages is least-effort given the repo. Point
      `zibaldone.ch` at it, force HTTPS. (The three subdomains above will need
      their own DNS + hosting too, whenever those projects are ready.)
- [ ] **OG image**, 1200×630, so shared links aren't bare.
- [ ] **Favicon set.** SVG exists; add a 180×180 PNG for iOS home screen.
- [ ] **Real-device pass** on iOS Safari and Android Chrome — the hover/touch
      split on the caption is the thing worth checking.

### Later
- [ ] Self-host Inter (and Instrument Serif) to drop the Google Fonts request.
- [ ] `sitemap.xml` + `robots.txt` once deployed.

### Watch out for
- `id` values are the saved-items key. Renaming one silently drops a save.
- `data.js` will grow. Fine into the hundreds.
- The champagne accent works *because* it is rare. Every new use dilutes it.
- The corner marks are fixed + low-opacity on purpose. Don't let them creep
  up in opacity or size "for visibility" — the reference mood is a hint in
  the dark, not an illustration.

---

## Decisions

| Date | Decision | Why |
|---|---|---|
| 2026-08-15 | The homepage is a wordmark + search + chips + card grid. Full stop. | Settled after v0.3 was rejected. Improvements go into materials — colour, hairlines, spacing, type — never into new sections. |
| 2026-08-15 | Warm ink + a single champagne accent | The way to make this layout feel expensive without adding anything to it. Warmth does more work than any effect. |
| 2026-08-15 | Resting hairline on every card | Cards floating borderless on black read as unfinished; a drawn grid reads as deliberate. |
| 2026-08-15 | Caption as a floating hover tooltip | The owner wants the card filled by its title with no dead space, and the caption only on hover — as in the LKs reference. A floating layer is the only way to have both. On touch it becomes a static second line, since there is no hover. |
| 2026-08-15 | Placeholders ship as `status: 'wip'` cards | An honest "Soon" beats a dead link, and it puts the projects on the page before they exist. |
| 2026-08-15 | LKs credit stays in the footer, as a link | Owner's call, and the right one. |
| 2026-08-15 | Separate `data.js`, loaded as a plain script | Adding a site should be a one-object diff, and `fetch` would break `file://`. |
| 2026-08-16 | LKs credit link removed from the footer | Owner's call — reverses the 2026-08-15 decision above. |
| 2026-08-16 | Grid sorts newest-first by `added`, no manual sort control | The data model already carried the date; a new card should just take the front row on its own. |
| 2026-08-16 | Default chip is "Made by JYe", not "All" | Owner wants their own work to be the first thing a visitor sees. |
| 2026-08-16 | Wordmark sets in Instrument Serif italic; a one-line tagline sits under it | Owner's explicit call. Narrow, deliberate exception to "Inter only" and "no tagline" — one line, no further copy. |
| 2026-08-16 | Tooltip descriptions capped at ~8–10 words, down from ~110 characters | The old length overflowed a glance-tooltip into something you had to actually read. |
| 2026-08-16 | Wordmark uses positive letter-spacing (`.015em`), not negative | Instrument Serif italic read squashed with the negative tracking carried over from the Inter body copy. Positive tracking is correct for this typeface at display size. |
| 2026-08-16 | Two fixed, hand-built corner marks — a rose (red, bottom-right) and a pen nib (neutral, bottom-left) | Owner's explicit call, referencing a "single rose on black" mood and the site's own "notebook" identity. Kept fixed, low-opacity, outside the card grid, off on mobile — so it stays a hint, not a second design system. Not a reopening of the v0.3 "generated cover art" rejection (see CLAUDE.md § 6). |

---

## Open questions

- Domain: is `zibaldone.ch` registered, and where is DNS managed?
- Analytics: none at all, or something privacy-friendly (Plausible / Umami)?
- Is the champagne accent right, or should it go back to neutral/white-only?
- Should client work (Ravioli Milano) eventually get its own chip?
