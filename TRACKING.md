# TRACKING.md — zibaldone.ch

Living log of the project: what's done, what's next, what was decided and why.
Update this in the same commit as the change it describes.

---

## Status

| | |
|---|---|
| Phase | `v0.5` — real links, sort order, footer & type pass |
| Live at | not deployed yet |
| Repo | https://github.com/skymemoryGit/Zibaldone_Homepage |
| Last update | 2026-08-16 |

---

## Changelog

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

---

## Open questions

- Domain: is `zibaldone.ch` registered, and where is DNS managed?
- Analytics: none at all, or something privacy-friendly (Plausible / Umami)?
- Is the champagne accent right, or should it go back to neutral/white-only?
- Should client work (Ravioli Milano) eventually get its own chip?
