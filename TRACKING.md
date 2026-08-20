# TRACKING.md — zibaldone.ch

Living log of the project: what's done, what's next, what was decided and why.
Update this in the same commit as the change it describes.

---

## Status

| | |
|---|---|
| Phase | `v0.9.1` — logo-derived identity, ink/paper themes, grid/index views |
| Live at | <https://zibaldone.ch> |
| Repo | https://github.com/skymemoryGit/Zibaldone_Homepage |
| Last update | 2026-08-20 |

---

## Changelog

### v0.9.1 — 2026-08-20 — mobile header, default theme

Three fixes, all from one screenshot of the live site on the owner's phone.

- **Dead space above the logo.** `.shell` had `clamp(56px, 12vh, 120px)` of
  top padding. On a tall handset 12vh is ~150px, so the logo started a
  thumb-length down an empty screen. Phones now get a flat `30px`; the
  desktop value is untouched. Lesson recorded in CLAUDE.md § 6: don't size
  mobile spacing in `vh`.
- **Ink is now the default theme for everyone**, instead of following
  `prefers-color-scheme`. The owner's phone is in light mode, so the site was
  introducing itself as paper — and the logo is cream on brown. Paper is still
  one tap away and is still remembered once chosen. `<meta name="theme-color">`
  lost its `media` attributes and is updated by `applyTheme()`, so the browser
  chrome follows the page rather than the OS.
- **"Picks by JYe" was being cut mid-word** on the chip row: the four tools
  take ~160px, leaving the chips too little space, and the scroll-fade hid the
  damage rather than showing it. Below 620px the toolbar now wraps — chips get
  the full row (all three fit uncut at 375px), tools sit underneath. The
  horizontal scroll stays as a fallback for longer labels or large system
  font sizes.

Not reported, spotted in the same screenshot — worth knowing: **the site is
live at zibaldone.ch.** The Backlog below said otherwise and has been updated.

### v0.9 — 2026-08-20 — the logo becomes the design system

Built and reviewed in a throwaway `rework total/` sandbox first, at the
owner's request ("se non fa bene verrà cancellata"), then **approved and
promoted to the root** — "questo sotto è ufficiale, che va a sostituire quella
della cartella successiva… questo stile mi piace veramente tanto". The sandbox
folder is gone; this is the site now.

Structure is unchanged: still a wordmark, a search field, chips and a compact
list. No hero, no featured object, no about, no CTA — the v0.3 homepage did not
come back. Everything below is material or interaction.

**The logo (`assets/logo/main2.png`) set the palette.** It was sampled, not
placed next to:
- its ground `#29221D` **is** the page background now — a warm brown, replacing
  the near-black `#080808`;
- its cream `#EFD3B5` replaces champagne as the accent, deepened one step to
  `#E8C49B` because at the source value the accent and `--ink` sit almost on
  top of each other in lightness;
- it is drawn on **ruled paper**, and that ruling — measured off the file at a
  ~29px pitch — is now the page background: two hairline gradients at 4%. This
  is the move that does the most work; the emblem stops looking like a PNG
  pasted onto a page and starts looking like it was printed on it.

**The emblem is scontornato, not cropped.** The artwork is converted to a mask
(how far each pixel travels from the field toward the cream) and repainted per
theme, so no rectangle edge appears when the theme flips. Two tints ship, plus
two favicons generated from the same source. `tools/extract-logo.py`
regenerates all four; its alpha floor is what cuts the printed grid out.

**The lettering stays live text.** Playfair Display switched from italic to
**roman**, uppercase, `.155em` tracking, reproducing the logo lockup in type
rather than as a second image. Selectable, searchable, reflows.

**Two new interactions**, both requested as "un po' di animazione":
- **Ink / paper themes.** Full token override per theme, never an inversion.
  Persisted; follows the OS until the visitor chooses. The toggle shows the
  state you are *in*, not the one you'd get.
- **Grid / index views.** The same items render as cards or as a numbered
  notebook index. They are the *same DOM nodes* under different CSS, which is
  what lets them physically travel between layouts (FLIP) instead of
  crossfading. Filtering and searching now reflow for free on the same path.

**Removed:** the pen-nib corner mark (the logo is a quill — the two said the
same thing twice) and the now-unused `favicon.svg`. The rose stays.

Fixed while testing: `.seg__btn` was a 40px touch target (now 44), the index
row folded to three lines / 117px on a phone (now two / 74px, via explicit
`order` values), and arrow-key navigation stalled on `soon` cards — their link
overlay is a `<span>`, which cannot take focus.

Verified by computed styles at 1280px and 375px in both themes and both views:
contrast 4.7–14.2:1 throughout, all touch targets ≥44px, no horizontal scroll,
tooltip contained, every asset resolving. Screenshots were unavailable — see
the note now in CLAUDE.md § 6 about the pane not compositing frames, which
produced two convincing phantom bugs during this work.

### v0.8.1 — 2026-08-20 — contrast + touch targets
Accessibility only. **No visual redesign** — the layout, palette, chip/card
treatment and wordmark are untouched; asked for "sistemare la grafica", the
answer was to fix what was measurably broken rather than restyle what the
owner already signed off on (see the v0.8 revert above).

- **`--ink-3` `#6B6862` → `#807C75`.** The old value scored **3.54:1** on
  `--bg`, under the 4.5:1 floor for body text — and it carries the tagline,
  every `.card__meta`, the result count, the footer and the search
  placeholder, i.e. most of the small text on the page. Now **4.82:1**. It is
  still visibly the quietest of the three inks; the "quiet" register survives.
- **`.card--soon .card__meta` no longer dims to a hardcoded `#56534E`**
  (~2.6:1, and a raw hex outside the token set). A "soon" card is already
  marked twice — the title drops to `--ink-2` and the meta line ends in
  "Soon" — so colour was never carrying that meaning alone.
- **Touch targets brought to 44px** via `::before` hit-area overlays, which
  draw nothing: chips 36px → 48px tall, `.icon-btn` 36 → 44, `.search__clear`
  24 → 44. Padding was deliberately *not* used — it would have fattened the
  pills and broken the toolbar rhythm.
- **The star's hit area only grows on coarse pointers.** It sits above
  `.card__link`, so a 44px zone there swallows card-link clicks along the
  right edge — worth it for a finger, not for a mouse that can hit 28px
  exactly. Visual size stays 28px everywhere.

Verified by reading computed styles at 1280px and 375px (the pane wouldn't
composite, so screenshots were unavailable — § 7's documented fallback).
Two phantoms chased and dismissed along the way, both worth knowing about:
a stray tooltip `transform` on touch that turned out to be a stale in-flight
transition from live-resizing rather than a real leak past the hover guard,
and `card--flip` never applying on load — which is just `requestAnimationFrame`
not firing in a hidden tab. Neither is a site defect; no code changed for them.

### v0.8 — 2026-08-16 — revert v0.7, footer credit onto one line
The v0.7 "luxury-editorial" pass (below) was rejected outright — owner's
words: "fa schifo… era molto meglio prima" (looks bad, it was much better
before). Reverted in full:
- `--bg` back to `#080808`, `--accent` back to champagne `#B9A77D`, `--ink-2`/
  `--ink-3` back to their warm v0.6 values, container back to `1180px`, card
  radius back to `14px`.
- Search field back to the boxed style (background + border + radius),
  focus brightens the box rather than warming an underline.
- Filters back to pill chips with a filled `aria-selected` state — the
  underline-text-link treatment is gone.
- Cards back to a visible `--surface` fill, compact `16px 17px` padding,
  200ms hover transition, `translateY(-2px)` lift. No index numbers, no
  uppercase/wide-tracking meta — both were v0.7-only additions.
- Rose corner mark back to its original **red** multi-tone palette (was
  recoloured monochrome bronze in v0.7).
- Load-in motion (`revealBlur`/`fadeUp`, 80ms card stagger) removed; cards
  use the original flat 26ms-per-card stagger, capped 300ms.

**One thing kept, by explicit request** ("al max tieni font del titolo" —
at most, keep the title font): the wordmark stays in **Playfair Display**
italic rather than reverting to Instrument Serif. Its size, weight, tracking
and margins are back to the v0.6 numbers though — only the typeface name
changed, not how it's set.

**Footer**: the "Inspired by LKS" credit (re-added earlier today, see v0.7
entry) is kept, but combined onto **one line** with "Powered by Jc.Ye" —
"Powered by Jc.Ye · Inspired by LKS" — instead of two stacked lines. Owner's
explicit ask: as short as possible, link only on "LKS".

### v0.7 — 2026-08-16 — luxury-editorial styling pass
A full visual rewrite, styling and UI/UX only — content, data, DOM structure
and every existing behaviour (search, filters, links, saved items) are
unchanged. See CLAUDE.md § 6 for the new token set and rules; summary here:

- **Background**: flat `#080808` → warm deep `#0e0d0b`, plus an
  extremely faint bronze radial glow behind the wordmark (`rgba(201,169,110,
  .045)`, was a paler warm-white glow).
- **Wordmark**: swapped Instrument Serif → **Playfair Display, italic 600**,
  sized up (clamp 56–112px, was 50–98px), more space below. Letter-spacing
  reset to `0` — Playfair italic doesn't read narrow the way Instrument
  Serif did, so the positive tracking added in v0.6 no longer applies.
- **Subtitle**: 13.5px dim `--ink-3` → 16–18px `--ink-2` (`#a1a1aa`), line-
  height 1.6. Reads as a real subtitle now, not a caption.
- **Whitespace**: container `1180px` → `1120px`; header, toolbar-to-grid and
  card gaps all opened up. The page breathes more between sections.
- **Search**: boxed SaaS-style input → minimal underline field. Transparent
  background, `border-bottom` only, no radius. Focus warms the line to
  `--accent` instead of brightening the whole box.
- **Filters**: pill buttons with a filled active state → plain text links.
  Selected state is a 1px gold underline that grows in from the left
  (`transform: scaleX()`), not a background swap.
- **Cards**: near-invisible background (`rgba(255,255,255,.012)`), hairline
  border down to `rgba(255,255,255,.06)`, radius `14px → 10px`, more padding
  (16–17px → 24px), no shadow ever. Added a small italic gold index number
  ("01", "02", …) per card — decorative, reflects position in the current
  sorted/filtered list, not a stable ID. Meta line (tags + "Soon") now
  uppercase with `.16em` tracking at 10.5px, matching an editorial caption
  rather than a UI label.
- **Card hover**: 200ms linear-ish ease → 400ms `--ease-out`, lift capped at
  4px (was 2px), border warms toward `--accent` at low opacity instead of
  just brightening to `--line-2`-neutral, and the title now nudges 3px
  right. No glow, no bounce.
- **Footer**: divider recoloured to a faint gold (`--divider`,
  `rgba(201,169,110,.14)`) instead of the neutral hairline; "Powered by
  Jc.Ye" is now uppercase with wide tracking; GitHub/LinkedIn hover to
  `--accent` with a thin underline instead of just brightening to `--ink`.
  **LKS credit re-added** as a short second line, "Inspired by LKS" →
  <https://lkssite.vip/> (the live site, not the GitHub repo this time) —
  see Decisions; this flip-flopped twice today, don't flip it a third time
  without asking.
- **Corner marks**: rose recoloured from a red multi-tone bloom to
  **monochrome bronze**, opacity dropped `.2 → .09` ("quasi invisibile" was
  the brief — it was reading as too saturated/random against the rest of the
  system). Pen mark unchanged in colour, opacity trimmed slightly (`.16 →
  .13`) to match the new overall restraint.
- **Motion on load**: new entrance sequence — wordmark and tagline fade +
  blur in (`revealBlur`), search and filters fade up (`fadeUp`), cards fade
  up with an 80ms stagger (was a flat 26ms-per-card, capped 300ms; now
  capped 480ms). Fully neutralised under `prefers-reduced-motion`, with an
  explicit reset block rather than relying on near-zero duration alone.

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
- [x] **Deploy.** Live at `zibaldone.ch` — confirmed from a screenshot of the
      site on the owner's phone on 2026-08-20. (The three subdomains above
      will still need their own DNS + hosting whenever those projects ship.)
- [ ] **OG image**, 1200×630, so shared links aren't bare. The logo now gives
      an obvious source — the emblem on `#29221D` with the ruling is basically
      `tools/logo-source.png` already.
- [x] **Favicon set.** 32×32 and 180×180 PNGs generated from the emblem by
      `tools/extract-logo.py`. The old `favicon.svg` is gone.
- [ ] **Real-device pass** on iOS Safari and Android Chrome — the hover/touch
      split on the caption is the thing worth checking.

### Later
- [ ] Self-host Inter and Playfair Display to drop the Google Fonts request.
- [ ] `sitemap.xml` + `robots.txt` once deployed.

### Watch out for
- `id` values are the saved-items key. Renaming one silently drops a save.
- `data.js` will grow. Fine into the hundreds.
- The accent works *because* it is rare. Every new use dilutes it.
- The corner mark is fixed + low-opacity on purpose. Don't let it creep up in
  opacity or size "for visibility" — the reference mood is a hint in the dark,
  not an illustration. Same for the ruling: 4% is not a mistake.
- **Never rebuild the list with `innerHTML`.** One element per site, built once
  and reordered — that identity is what makes the FLIP motion work. See
  CLAUDE.md § 5.
- Any new colour needs measuring in **both** themes, not one.
- The emblem PNGs are generated. Edit `tools/extract-logo.py` and re-run it;
  don't retouch the files by hand.

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
| 2026-08-16 | Full "luxury-editorial" restyle: gold/bronze `#c9a96e` accent replaces champagne `#B9A77D`, Playfair Display replaces Instrument Serif, cards/search/filters de-boxed | Explicit, detailed owner brief (15-point spec). Styling and UI/UX only — content, structure and functionality were explicitly required to stay unchanged, and did. |
| 2026-08-16 | Rose corner mark recoloured red → monochrome bronze, opacity `.2 → .09` | Same brief: the red mark read as "too saturated/random" against the rest of the (now gold-only) system. Kept, not removed, since the owner said "if kept, make it monochrome" rather than "remove it". |
| 2026-08-16 | LKs credit re-added to the footer, as a short "Inspired by LKS" line → lkssite.vip | Owner's call, same day as the removal above — reverses it a second time. Points at the live site now, not the GitHub repo. If this needs to change again, ask first; it's flipped twice in one day already. |
| 2026-08-16 | The "luxury-editorial" restyle (previous row) is reverted in full — champagne, pill chips, boxed search, compact cards are back | Owner's verdict: "fa schifo… era molto meglio prima" (looks bad, much better before). Rejected outright, not iterated on. If a similar direction comes up again, ask before rebuilding it. |
| 2026-08-16 | Wordmark keeps Playfair Display (not reverted to Instrument Serif), but at the original v0.6 size/weight/tracking | The one piece of the reverted pass the owner asked to keep — "al max tieni font del titolo" (at most, keep the title font). |
| 2026-08-16 | Footer credit combined onto one line: "Powered by Jc.Ye · Inspired by LKS" | Owner's explicit ask, same message as the revert — as short as possible, link only on "LKS". |
| 2026-08-20 | `--ink-3` lightened to clear 4.5:1, and touch targets padded out to 44px via invisible `::before` overlays | Asked to "improve the graphics", the honest answer was that nothing about the look was wrong — the small text was failing contrast at 3.54:1 and the controls were finger-hostile. Fixed the measurable defects, changed no design decision. The dimmest grey on the page is a token with a floor now: check the ratio before retuning it. |
| 2026-08-20 | Redesigns get built in a throwaway sandbox folder first, then promoted if approved | Owner's framing: "puoi fare quel cavolo che vuoi… se non fa bene verrà cancellata". It let a full restyle be judged on the real thing without risking the working site — worth repeating for the next big visual change. |
| 2026-08-20 | The whole palette is **sampled from the logo**, including the page background (`#29221D`) and the ruled-paper texture | Approved and promoted to the root. The logo turned out to be a brief, not an asset: taking its ground and its grid is what makes the emblem sit *in* the page rather than on it. Corollary: if the logo ever changes, the palette changes with it — re-sample, don't patch. |
| 2026-08-20 | Wordmark: Playfair Display **roman**, uppercase, wide tracking — reversing the "display italic" rule | The logo sets ZIBALDONE upright and in caps; the wordmark now matches it. Kept as live text rather than shipping the name as a second image, so it stays selectable and reflows. The 2026-08-16 positive-tracking decision still holds and matters more than ever here. |
| 2026-08-20 | Site gains a second theme (ink / paper) and a second layout (grid / index) | Requested surprise, delivered as interaction rather than structure — no new sections, so the v0.3 rejection stands untouched. Both are the same items under different tokens/CSS; the index in particular is *the same DOM nodes*, which is what makes the FLIP motion honest. |
| 2026-08-20 | Pen-nib corner mark removed | The logo is a quill. The two marks were saying the same thing twice. The rose stays — that was an explicit owner request and is a separate motif. |
| 2026-08-20 | Ink is the default theme on a first visit; the site does not follow `prefers-color-scheme` | Owner's call after seeing the live site open in paper on a light-mode phone. The logo is cream on brown — that is how the site should introduce itself. Paper stays one tap away and is remembered once chosen, so nothing is taken from anyone who wants it. |
| 2026-08-20 | One inline script allowed in `<head>`, breaking the "no inline scripts" rule | It stamps the saved theme before first paint. The alternative is a full-screen light flash for every ink-theme visitor on every navigation. Narrow, documented exception — don't "tidy" it into `app.js`. |

---

## Open questions

- Domain: is `zibaldone.ch` registered, and where is DNS managed?
- Analytics: none at all, or something privacy-friendly (Plausible / Umami)?
- Is the champagne accent right, or should it go back to neutral/white-only?
- Should client work (Ravioli Milano) eventually get its own chip?
