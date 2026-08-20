# zibaldone.ch

A small directory of pages — things I build, and a few worth keeping open.

Static, dependency-free homepage. No framework, no build step: clone it and open
`index.html`.

```
index.html               markup
assets/css/style.css     styling (design tokens at the top of the file)
assets/js/data.js        every card on the site lives here
assets/js/app.js         search, filters, saved items, themes, layouts
assets/img/              the emblem (two tints) + favicons + corner mark
tools/extract-logo.py    regenerates those PNGs from the original logo
```

Two themes (ink / paper) and two layouts (grid / index), both toggled from the
toolbar and remembered between visits.

## Adding a site

Append one object to `SITES` in `assets/js/data.js`:

```js
{
  id: 'my-new-thing',
  name: 'My New Thing',
  url: 'https://example.com/',
  desc: 'What it does, in one plain sentence.',
  tags: ['Tool', 'Web'],
  collection: 'mine',        // 'mine' | 'picks'
  status: 'live',            // 'live' | 'wip' | 'soon'
  added: '2026-08-15',
}
```

Counts, filters and search update themselves. Full field reference in
[`CLAUDE.md`](CLAUDE.md); roadmap in [`TRACKING.md`](TRACKING.md).

## Credit

Design inspired by [LKs 网站推荐合集](https://github.com/xiangjianan/lks) by -LKs-.

Built by [Jc.Ye](https://www.linkedin.com/in/jiancheng-ye-790966201).
