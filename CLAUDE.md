# CLAUDE.md — zibaldone.ch

Context for any AI assistant (or future me) working on this repo. Read this
before touching anything.

---

## 1. What this is

`zibaldone.ch` — the homepage of Jiancheng Ye (Jc.Ye). It is a **link
directory**: a quiet grid of compact cards pointing to two kinds of things.

| Collection | `collection` value | What goes in it |
|---|---|---|
| **Made by JYe** | `mine`  | Pages/apps I built myself, including client work |
| **Picks by JYe** | `picks` | Other people's sites worth keeping open |

The reference was [LKs 网站推荐合集](https://github.com/xiangjianan/lks) — no
longer credited in the footer (owner's call, 2026-08-16; see Decisions).

### The design brief — read this before proposing anything

**A wordmark, a search field, three chips, a grid of compact cards. That is the
whole page.** The owner has rejected, explicitly and more than once:

- extra prose — no section copy, no explanatory paragraphs beyond the one-line
  tagline under the wordmark (added 2026-08-16, owner's explicit call — don't
  extend it into more copy);
- dead space inside cards;
- captions that take up layout instead of appearing on hover;
- **a multi-section "editorial" homepage** (hero / featured / about / CTA /
  colophon), generated cover art. This was built once and thrown out. Do not
  propose it again.

The direction is: *this layout, better materials.* Improvements belong in
colour, hairlines, spacing and type detail — not in new structure. The one
deliberate exception is the wordmark, which sets in a display italic — see § 6.

**Site language is English.** Chat with the owner may be in Italian; the
product is not.

---

## 2. Stack & constraints

- **Plain static HTML/CSS/JS.** No framework, no bundler, no npm, no build step.
- Opening `index.html` over `file://` must keep working — that rules out
  `fetch()` for the data and ES modules.
- No runtime dependencies. The only external request is the Google Fonts
  stylesheet, and the CSS declares a full fallback stack.
- Deploy target: any static host (GitHub Pages / Netlify / Cloudflare Pages).
  Repo: <https://github.com/skymemoryGit/Zibaldone_Homepage>

---

## 3. File map

```
index.html               markup only — no inline styles, no inline scripts
assets/css/style.css     all styling; design tokens in :root at the top
assets/js/data.js        THE CONTENT. Editing the site = editing this file.
assets/js/app.js         render + search + filter + saved items (~190 lines)
assets/img/favicon.svg   notebook mark
CLAUDE.md                this file
TRACKING.md              roadmap + changelog + decisions
```

Load order matters: `data.js` must come before `app.js`.

---

## 4. How to add a site (the 90% task)

Append one object to `SITES` in `assets/js/data.js`. Nothing else changes.

```js
{
  id: 'my-new-thing',                 // unique slug; NEVER rename (breaks saved items)
  name: 'My New Thing',
  url: 'https://example.com/',        // '#' if not live yet
  desc: 'What it does, in 8–10 words.',
  tags: ['Tool', 'Web'],              // 1–3 short tags
  collection: 'mine',                 // 'mine' | 'picks'
  status: 'live',                     // 'live' (default) | 'wip' | 'soon'
  added: '2026-08-15',                // ISO date — drives sort order, newest first
}
```

House rules for `desc` — it is the only prose on the page, so it has to be good:
- Say what the site **does**, not why it's great.
- One short phrase, **8–10 words max**. It has to fit a small tooltip at a glance.
- No marketing adjectives, no exclamation marks.

`status: 'wip'` / `'soon'` dims the title, appends "Soon" to the meta line and
disables the link. Better than a dead link.

The grid always sorts by `added`, newest first (see § 5) — so `added` is not
just bookkeeping. A new card with a later date takes the front row and pushes
everything else back automatically. No other field needs to change.

---

## 5. Behaviour reference

- **Search** — matches name + desc + tags + collection, multi-term AND
  (`slow game` needs both). Debounced 90 ms. `/` focuses from anywhere,
  `Esc` clears.
- **Filters** — one active chip at a time. Chip order is `mine`, `picks`,
  `all` — "Made by JYe" is also the **default** collection on load, not "All".
- **Sort** — every render sorts the filtered list by `added`, newest first.
  No manual control; the data model drives it.
- **Saved** — the star on each card, in `localStorage` under
  `zibaldone.favs.v1`, wrapped in try/catch because private mode and embedded
  webviews throw. Keyed by `id` — hence the rename ban.
- **Result count** — only rendered while a search/filter is active.
- **The caption (`.tip`) is the delicate part.** Read before touching:
  - On hover devices it is a floating tooltip, `position: absolute`, so it
    takes up **no layout** — cards stay compact and the grid never moves.
  - `placeTooltips()` adds `.card--flip` to every card on the top row so its
    tooltip drops below instead of off-screen. Re-runs on render and (debounced)
    on resize, because the column count is responsive.
  - Everything that positions the tooltip lives inside
    `@media (hover: hover) and (pointer: fine)` — **including `.card--flip`**.
    On touch the tooltip becomes a static line in the flow, and any stray
    `transform`/`top` from an unguarded rule drags it out of the card. This was
    a real bug; don't undo the guard.
  - Keep it near-opaque (`rgba(26,25,23,.975)`): it overlaps other cards and
    `backdrop-filter` alone is not enough to keep the text readable.
  - Never put `opacity` on `.card` — it fades the tooltip inside it too. Dim
    `.card__title` / `.card__meta` instead (that is what `.card--soon` does).
  - `.card:hover` needs its own `z-index`, because `transform` creates a
    stacking context that would otherwise bury the tooltip under later siblings.

---

## 6. Design system

Tokens are the contract. Change `:root`, not individual rules.

```
--bg #080808   --surface rgba(244,241,234,.035)   --surface-2 …062
--line rgba(244,241,234,.085)                     --line-2 …17
--ink #F2EFE9  --ink-2 #9A968E                    --ink-3 #6B6862
--accent #B9A77D  (champagne — the only colour on the page)
```

Three things carry the "quiet luxury" register, and they are all material:

1. **`--ink` is warm paper-white, never `#FFF`** — and every grey is warm to
   match. This is most of the effect; a cold blue-white undoes it instantly.
2. **Champagne is the only colour**, and it is rare: the search icon on focus,
   the external arrow on hover, the saved star, the focus ring. If you find a
   fifth use, that's the signal to stop.
3. **Every card carries a resting hairline** (`--line`), so the grid reads as
   something *set* rather than shapes floating on black. Hover moves the
   hairline to `--line-2` — the border does the work, not a glow.

Type: Inter for everything except the wordmark, which sets in **Instrument
Serif, italic** (`--font-display`) — the one deliberate display-type accent on
the page, owner's explicit call (2026-08-16). Negative tracking (`-.012em`
body) is what keeps the Inter side from reading as generic sans; the wordmark
needs much less (`-.01em`), since serif italics are already narrow.

The wordmark is the one flourish: a sheen sweeps across once on load, passing
through champagne, then settles to flat ink. `background-size: 300%` means the
visible window is a third of the gradient, so at both ends it is solid ink and
only the pass shows. If you change the stops, re-check both ends.

Easy to break by accident:
- Body copy never below 12.5px.
- Everything interactive needs a visible `:focus-visible` ring.
- The whole card is the link (`.card__link` overlay); the star sits above it.
- `prefers-reduced-motion` block at the bottom of the CSS — extend it if you
  add animation.

---

## 7. Working style

- Mobile first. Check 390px before calling anything done — it is where the
  complaints come from.
- Verify visually: screenshot desktop **and** mobile after any layout change.
  This page has hover-only states that are easy to break blind.
- When screenshotting mobile in Playwright, do **not** use `fullPage: true`
  with device emulation — it renders the hover-device layout and produces
  phantom floating tooltips. Take viewport shots and scroll, or read computed
  styles.
- Keep `app.js` framework-free and under ~250 lines.
- Any string reaching the DOM goes through `esc()`.
- Update `TRACKING.md` in the same commit as the change it describes.

## 8. Not yet decided

Open questions live in `TRACKING.md` § Open questions. Don't guess — ask.
