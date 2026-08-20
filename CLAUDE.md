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

The reference was [LKs 网站推荐合集](https://github.com/xiangjianan/lks). The
footer credit flipped twice on 2026-08-16 (removed, then re-added pointing at
the live site instead of the GitHub repo) before settling on its current
form: "Powered by Jc.Ye · Inspired by LKS", both on one line, LKS linking to
<https://lkssite.vip/>. See Decisions if you need the history; don't restyle
this back onto two lines without asking — that was explicitly undone.

### The design brief — read this before proposing anything

**A logo, a wordmark, a search field, three chips, a compact list of links.
That is the whole page.** The owner has rejected, explicitly and more than
once:

- extra prose — no section copy, no explanatory paragraphs beyond the one-line
  tagline under the wordmark (added 2026-08-16, owner's explicit call — don't
  extend it into more copy);
- dead space inside cards;
- captions that take up layout instead of appearing on hover;
- **a multi-section "editorial" homepage** (hero / featured / about / CTA /
  colophon), generated cover art. This was built once and thrown out. Do not
  propose it again.

The direction is: *this layout, better materials.* Improvements belong in
colour, hairlines, spacing, type detail and interaction — not in new structure.

Two deliberate exceptions, both signed off: the wordmark sets in a display
serif (§ 6), and the list has a second layout — the notebook **index** — which
is the same items under different CSS, not a new section (§ 5).

The emblem is **not** a hero image. It sits flush left above the name at
letterhead scale. Centring it and sizing it up is precisely how this turns
back into the v0.3 homepage that was thrown out.

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
index.html                     markup; one inline script only — see below
assets/css/style.css           all styling; design tokens in :root at the top
assets/js/data.js              THE CONTENT. Editing the site = editing this file.
assets/js/app.js               render + search + filter + saved + theme + views
assets/img/logo-mark.png       the emblem, cream — ink theme
assets/img/logo-mark-paper.png the emblem, dark brown — paper theme
assets/img/favicon-32.png      favicon, generated from the emblem
assets/img/favicon-180.png     iOS home screen icon, same source
assets/img/rose-mark.svg       hand-built corner watermark — see § 6
tools/logo-source.png          the original logo (= assets/logo/main2.png)
tools/extract-logo.py          regenerates all four PNGs above from it
CLAUDE.md                      this file
TRACKING.md                    roadmap + changelog + decisions
README.md                      short public-facing readme
```

Load order matters: `data.js` must come before `app.js`.

**The one inline script.** `<head>` stamps the saved theme onto `<html>` before
first paint. It breaks the old "no inline scripts" rule on purpose: running it
with `app.js` flashes a full-screen light page at every ink-theme visitor, on
every navigation. Don't move it into `app.js` to tidy up.

`assets/logo/` holds the owner's original logo uploads and is not used by the
page at runtime — `tools/logo-source.png` is the copy the build script reads.

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
- **Views** — `grid` (cards) or `index` (numbered notebook list: number, title,
  dotted leader, tags, date). Toggled by the segmented control, persisted in
  `zibaldone.view.v1`. Below 620px the index row folds to two lines; the
  explicit `order` values in that media query are load-bearing — without them
  the date wraps to a third line and the row grows to ~117px, which is no
  longer an index you can scan.
- **Theme** — `ink` or `paper`, persisted in `zibaldone.theme.v1`. **Ink is the
  default for everyone on a first visit; the page deliberately does NOT follow
  `prefers-color-scheme`** (owner's call, 2026-08-20 — the logo is cream on
  brown and that is how the site should introduce itself). Paper is a choice
  you make, and once made it is remembered. The `<meta name="theme-color">` has
  no `media` attribute for the same reason and is updated by `applyTheme()`.
  The toggle shows the state you are **in** (moon at night, sun on paper).
- **Keyboard** — `/` focuses search; arrows walk the list. The column count is
  read from the live layout, never assumed. Arrow travel **skips `soon` items**:
  their overlay is a `<span>`, which cannot take focus, so landing on one would
  strand the caret.
- **The caption (`.tip`) is the delicate part.** Read before touching:
  - On hover devices it is a floating tooltip, `position: absolute`, so it
    takes up **no layout** — in *both* views. Nothing ever shifts.
  - `placeTooltips()` adds `.item--flip` to every item on the top row so its
    tooltip drops below instead of off-screen. Re-runs on render and (debounced)
    on resize, because the column count is responsive.
  - Everything that positions the tooltip lives inside
    `@media (hover: hover) and (pointer: fine)` — **including `.item--flip`**.
    On touch the tooltip becomes a static line in the flow, and any stray
    `transform`/`top` from an unguarded rule drags it out of the item. This was
    a real bug; don't undo the guard.
  - Keep it near-opaque (`--tip-bg`): it overlaps other cards and
    `backdrop-filter` alone is not enough to keep the text readable.
  - Never put `opacity` on `.item` — it fades the tooltip inside it too. Dim
    `.item__title` instead (that is what `.item--soon` does).
  - `.item:hover` needs its own `z-index`, because `transform` creates a
    stacking context that would otherwise bury the tooltip under later siblings.
  - In the **index** on touch the caption is hidden outright: it would double
    every row's height, and the index exists to be scanned.

### The one architectural rule in `app.js`

**Every site owns exactly one element, built once at boot and kept in `nodes`
for the life of the page.** A render never rebuilds markup — it reorders the
elements that already exist and drops the ones that no longer match.

That is not an optimisation, it is what makes the motion work. Because the
element that was card #6 *is* the element that becomes index row #2, it can
measure where it used to be and animate from there (FLIP, in
`animateReflow()`). Rebuilding `innerHTML` destroys that identity and leaves
only a crossfade between two unrelated pictures. If you ever find yourself
writing `list.innerHTML = …`, stop.

`animateReflow()` checks `prefers-reduced-motion` in **JS** as well as CSS:
CSS alone cannot cancel a Web Animations call.

---

## 6. Design system

Tokens are the contract. Change `:root`, not individual rules. There are two
themes and **both must be defined in full** — paper is never a filter or an
inversion of ink.

```
            ink (default)   paper           contrast vs its own --bg
--bg        #29221D         #F5EDE1         —
--ink       #F2EDE6         #241E1A         13.5 : 1   /  14.2 : 1
--ink-2     #B6A895         #5C5044          6.7 : 1   /   6.7 : 1
--ink-3     #9A8D7B         #736759          4.8 : 1   /   4.7 : 1
--accent    #E8C49B         #7F6036          9.6 : 1   /   5.0 : 1
--rule      cream @ .04     brown @ .05     the notebook ruling
```

**The palette is sampled from the logo, not chosen next to it.** `#29221D` is
the exact field `main2.png` sits on and `#EFD3B5` is the exact cream of the
quill. That is why the emblem needs no plate, no box and no drop shadow. The
accent is deepened one step from that cream: at the source value the accent
and `--ink` sit almost on top of each other in lightness, and an accent that
reads as "the white, but warmer" has stopped being an accent.

The accent **must** change weight between themes. The logo's cream is roughly
1.2:1 on the paper sheet — it would vanish as text, as a focus ring and as an
icon. Same colour, same job, different weight.

**A "luxury-editorial" restyle was tried and reverted, same day (2026-08-16,
v0.7 → v0.8).** Deep-black bg, gold/bronze `#c9a96e` accent, pill-less text
filters, near-invisible cards, 16–18px subtitle, load-in blur/fade motion —
all of it. The owner's verdict, in full: "fa schifo… era molto meglio
prima" (looks bad, it was much better before). It's reverted in full. If
this direction gets proposed again — by a future assistant or by re-reading
an old plan — don't just redo it; the owner has now rejected it once
explicitly. Ask first. The one thing kept from that pass: the wordmark font
(Playfair Display, see below) — everything else in this section is the
restored v0.4–v0.6 system.

Four things carry the register, and they are all material:

1. **Every neutral is warm, and `--ink` is never `#FFF`** (nor `#000` on
   paper). A cold blue-white undoes the whole thing instantly.
2. **The accent is the only colour**, and it is rare: the search icon on
   focus, the external arrow on hover, the saved star, the focus ring. If
   you find a fifth use, that's the signal to stop.
3. **Every card carries a resting hairline** (`--line`), so the grid reads as
   something *set* rather than shapes floating on the ground. Hover moves the
   hairline to `--line-2` — the border does the work, not a glow.
4. **The notebook ruling** (`.bg`): two `repeating-linear-gradient` hairlines
   at a ~29px pitch, measured off the logo file, which is itself printed on
   ruled paper. This is what makes the emblem look like it belongs to the page
   rather than like a PNG pasted on top. It is texture, not illustration — no
   image, `z-index: -1`, and it drops out below 760px where it reads as
   clutter behind a dense grid.

Filters are pill chips (`.chip`, filled background + border when
`aria-selected="true"`) — **not** the underline-text-link treatment from the
reverted pass. Cards keep a visible `--surface` fill, `14px` radius, compact
`16px 17px` padding, and a `translateY(-2px)` hover with a 200ms transition —
not the near-invisible/generous-padding/400ms-ease-out treatment. If you're
tempted to reintroduce either, re-read the paragraph above first.

### The logo lockup

**The emblem is separated from its background, not cropped.** The artwork is
converted to a mask — how far each pixel travels from the field toward the
cream — then repainted in whichever colour the theme needs, so there is no
rectangle edge to show when the theme flips. Two tints ship: cream for ink,
dark brown for paper, swapped by CSS `display`. `tools/extract-logo.py`
regenerates both marks and both favicons; the alpha floor in it is what cuts
the printed grid ruling out of the mask. Don't hand-edit the PNGs — re-run the
script.

**The lettering stays live text.** The logo sets ZIBALDONE upright, in caps,
on a wide track, so the wordmark reproduces that lockup in type rather than
shipping the name as a second image — it stays selectable, searchable and it
reflows. Playfair Display **roman** (not italic), uppercase, `.155em` tracking.

Type: Inter for everything except the wordmark (`--font-display`). Body keeps
negative tracking (`-.012em`) to stay tight. The wordmark takes **positive**
tracking, and generously: uppercase serif at display size reads as a solid
block without it, and the tracking is what turns it back into the
inscriptional lockup the emblem is drawn to sit above. Don't reuse the body's
negative-tracking instinct here.

The wordmark keeps the one flourish: a sheen sweeps across once on load,
passing through the accent, then settles to flat ink. `background-size: 300%`
means the visible window is a third of the gradient, so at both ends it is
solid ink and only the pass shows. If you change the stops, re-check both
ends. It is delayed to land *after* the emblem fades in.

**Corner mark** (`.corner-mark--rose`): a hand-built SVG, fixed to the
viewport corner like `.bg`, low opacity, `pointer-events: none`, hidden below
760px, `mix-blend-mode: multiply` on paper so it sinks into the sheet instead
of sitting on it as a bright sticker. It is decoration, not content — this is
*not* the "generated cover art" the design brief rejects (that was per-card
auto-generated art inside the grid; this is one fixed, hand-authored mark in
the margin outside any card, at owner's explicit request).

The **pen-nib** corner mark was removed on 2026-08-20: the logo is a quill, so
the two were saying the same thing twice. Don't re-add it.

Easy to break by accident:
- Body copy never below 12.5px.
- **`--ink-3` has a contrast floor, in both themes.** It carries the tagline,
  every card's meta line, the count, the footer, the index numbers and dates
  and the search placeholder — most of the small text on the page. It was
  `#6B6862` until 2026-08-20, which is 3.54:1 and fails the 4.5:1 minimum for
  body text. Making the quiet greys quieter is a recurring instinct here —
  **measure the ratio before retuning it**, and don't reintroduce dimmer
  hardcoded greys (`.card--soon` used to drop its meta line to `#56534E`,
  ~2.6:1). Every colour claim in the token table above was measured, not
  eyeballed; keep it that way.
- **Touch targets are extended with invisible `::before` overlays**, not with
  padding — chips, `.seg__btn`, `.icon-btn`, `.search__clear` and (on coarse
  pointers only) `.star`. Padding would fatten the pills and break the toolbar
  rhythm. The star's overlay is deliberately scoped to touch: it sits above
  `.item__link`, so a 44px zone on desktop would eat card clicks along the
  right edge.
- **Don't size mobile spacing in `vh`.** `.shell` uses
  `clamp(56px, 12vh, 120px)` on top, which is right on a desktop window and a
  dead zone on a tall handset — 12vh there is ~150px of nothing above the
  logo. Phones get a flat `30px` instead. Same trap applies to any new
  viewport-relative spacing.
- **The toolbar wraps below 620px.** The four tools eat ~160px, which cut
  "Picks by JYe" mid-word behind the chip fade. Chips take the full row and
  the tools drop underneath; the horizontal scroll stays as a fallback for
  longer labels or large system font sizes. Don't un-wrap it to save a row.
- Everything interactive needs a visible `:focus-visible` ring.
- The whole card is the link (`.item__link` overlay); the star sits above it.
  On `soon` items that overlay is a `<span>` — see the keyboard note in § 5.
- `prefers-reduced-motion` block at the bottom of the CSS — extend it if you
  add animation, **and** guard any new Web Animations call in JS.
- The corner mark and the ruling must stay out of the print stylesheet and off
  narrow viewports. Print also force-swaps the emblem to its paper tint: the
  cream mark would print as a ghost if the visitor was in the ink theme.

### Verifying visually

The browser pane in this environment frequently **does not composite frames**:
screenshots time out, `requestAnimationFrame` never fires, and CSS transitions
and Web Animations sit frozen at their first keyframe. That produces very
convincing phantom bugs — a theme that "won't change", tooltips "escaping"
their card, elements "stuck" at old positions.

When it happens, read computed styles instead (§ 7 already allows this) and
call `document.getAnimations().forEach(a => a.finish())` **before every
measurement**. Confirm a suspected bug that way before fixing it; two of these
phantoms have already cost a debugging detour each.

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
- Keep `app.js` framework-free. The old "~250 lines" cap was raised to **~400**
  on 2026-08-20, when the file took on themes, the second layout, FLIP and
  keyboard navigation; it is ~375 now. The cap exists to stop a framework
  creeping in by increments, not to force clever compression — if it needs
  raising again, say so rather than quietly deleting the comments.
- Any string reaching the DOM goes through `esc()`.
- Update `TRACKING.md` in the same commit as the change it describes.

## 8. Not yet decided

Open questions live in `TRACKING.md` § Open questions. Don't guess — ask.
