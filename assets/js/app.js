/* =============================================================================
 *  app.js — rendering, search, filtering, saved items, theme, views.
 *  No framework, no build step, no fetch. Reads COLLECTIONS + SITES from data.js.
 *
 *  The one idea worth knowing before reading further: every site gets exactly
 *  ONE element, built once and kept in `nodes` for the life of the page. A
 *  render never rebuilds markup — it reorders the elements that already exist
 *  and drops the ones that no longer match.
 *
 *  That is what makes the motion honest. Because the element that was card #6
 *  IS the element that becomes index row #2, it can measure where it used to
 *  be and animate from there (FLIP). Re-rendering innerHTML would destroy that
 *  identity and leave only a crossfade between two unrelated pictures.
 * =========================================================================== */
(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);

  const FAV_KEY   = 'zibaldone.favs.v1';
  const THEME_KEY = 'zibaldone.theme.v1';
  const VIEW_KEY  = 'zibaldone.view.v1';

  /* localStorage throws in private mode and in embedded webviews. It must
     never be the reason the page fails to render. */
  const store = {
    read(key, fallback) {
      try { const v = localStorage.getItem(key); return v === null ? fallback : v; }
      catch { return fallback; }
    },
    write(key, value) {
      try { localStorage.setItem(key, value); } catch { /* ignore */ }
    },
  };

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

  /* --------------------------------------------------------------- state -- */
  const state = {
    q: '',
    collection: 'mine',
    favsOnly: false,
    view: store.read(VIEW_KEY, 'grid') === 'index' ? 'index' : 'grid',
    favs: (() => {
      try { return new Set(JSON.parse(store.read(FAV_KEY, '[]')) || []); }
      catch { return new Set(); }
    })(),
  };

  const el = {
    q:        $('#q'),
    qClear:   $('#qClear'),
    chips:    $('#chips'),
    list:     $('#list'),
    count:    $('#count'),
    empty:    $('#empty'),
    favBtn:   $('#favBtn'),
    themeBtn: $('#themeBtn'),
    reset:    $('#resetBtn'),
    segs:     [...document.querySelectorAll('.seg__btn')],
  };

  /* ------------------------------------------------------------ matching -- */
  function matches(site) {
    if (state.favsOnly && !state.favs.has(site.id)) return false;
    if (state.collection !== 'all' && site.collection !== state.collection) return false;

    const q = state.q.trim().toLowerCase();
    if (!q) return true;

    // every whitespace-separated term must appear somewhere — "slow game" works
    const hay = [site.name, site.desc, (site.tags || []).join(' '), site.collection]
      .join(' ').toLowerCase();
    return q.split(/\s+/).every((t) => hay.includes(t));
  }

  const isLive = (s) =>
    s.url && s.url !== '#' && s.status !== 'soon' && s.status !== 'wip';

  /* Index view shows a date column. "2026-08-15" is precise but reads as a
     serial number; month + year is what you actually scan an index for. */
  function shortDate(iso) {
    const d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return '';
    return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
  }

  /* --------------------------------------------------------- node factory -- */
  const ICON_EXT =
    '<svg class="item__ext" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M7.5 16.5L16.5 7.5M9 7.5h7.5V15" fill="none" stroke="currentColor" ' +
    'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const ICON_STAR =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.4l2.4 4.87 5.37.78-3.89 ' +
    '3.79.92 5.36L12 16.66l-4.8 2.54.92-5.36-3.89-3.79 5.37-.78z" fill="none" ' +
    'stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>';

  /** Built once per site, then reused forever. See the header note. */
  function buildItem(site) {
    const live  = isLive(site);
    const faved = state.favs.has(site.id);
    const meta  = [...(site.tags || []), live ? null : 'Soon']
      .filter(Boolean).map(esc).join(' · ');

    const node = document.createElement('article');
    node.className = 'item' + (live ? '' : ' item--soon');
    node.dataset.id = site.id;

    const link = live
      ? `<a class="item__link" href="${esc(site.url)}" target="_blank" rel="noopener noreferrer"
             aria-label="${esc(site.name)} — ${esc(site.desc || '')}"></a>`
      : `<span class="item__link" aria-hidden="true"></span>`;

    node.innerHTML = `
      ${link}
      <span class="item__num" aria-hidden="true"></span>
      <h2 class="item__title">${esc(site.name)}</h2>
      <span class="item__dots" aria-hidden="true"></span>
      <p class="item__meta">${meta}</p>
      <time class="item__date" datetime="${esc(site.added || '')}">${esc(shortDate(site.added || ''))}</time>
      <div class="item__aside">
        ${live ? ICON_EXT : ''}
        <button class="star" type="button" data-fav="${esc(site.id)}"
                aria-pressed="${faved}"
                aria-label="${faved ? 'Remove from' : 'Add to'} saved: ${esc(site.name)}"
                >${ICON_STAR}</button>
      </div>
      <p class="tip" role="tooltip">${esc(site.desc || '')}</p>`;

    return node;
  }

  const nodes = new Map(SITES.map((s) => [s.id, buildItem(s)]));

  /* ----------------------------------------------------------------- FLIP -- */
  /* First / Last / Invert / Play. Measure where everything is, let the caller
     change the DOM, measure again, then animate each element from its old
     position to its new one. Only `transform` is animated — never width, top
     or left — so none of this costs a layout pass per frame. */
  function animateReflow(mutate) {
    if (reduceMotion.matches) { mutate(); return; }

    const before = new Map();
    for (const node of el.list.children) {
      before.set(node.dataset.id, node.getBoundingClientRect());
    }

    mutate();

    for (const node of el.list.children) {
      const first = before.get(node.dataset.id);

      // Not on screen a moment ago: this one is arriving, so it fades up
      // instead of sliding from a position it never occupied.
      if (!first) {
        node.classList.remove('item--enter');
        void node.offsetWidth;            // restart the animation on re-entry
        node.classList.add('item--enter');
        continue;
      }

      const last = node.getBoundingClientRect();
      const dx = first.left - last.left;
      const dy = first.top  - last.top;
      if (!dx && !dy) continue;

      node.animate(
        [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
        { duration: 420, easing: 'cubic-bezier(.32,.72,0,1)' }
      );
    }
  }

  /* Nothing sits above the first row, so its tooltip would open off-screen —
     it flips underneath instead. Recomputed on every render and (debounced) on
     resize, because the column count is responsive. */
  function placeTooltips() {
    const items = [...el.list.children];
    if (!items.length) return;
    const top = Math.min(...items.map((n) => n.offsetTop));
    items.forEach((n) => n.classList.toggle('item--flip', n.offsetTop === top));
  }

  /* -------------------------------------------------------------- render -- */
  function render(withMotion = true) {
    // newest first — a new site with a later `added` date takes the front row
    // automatically, pushing everything else one step back.
    const list = SITES.filter(matches)
      .sort((a, b) => (b.added || '').localeCompare(a.added || ''));

    const apply = () => {
      const wanted = list.map((s) => nodes.get(s.id));
      const keep = new Set(wanted);

      for (const node of [...el.list.children]) {
        if (!keep.has(node)) node.remove();
      }
      // append() on an element already in the container MOVES it — the node
      // keeps its identity, its listeners and its saved state.
      el.list.append(...wanted);

      wanted.forEach((node, i) => {
        node.querySelector('.item__num').textContent = String(i + 1).padStart(2, '0');
      });

      el.list.classList.toggle('list--grid',  state.view === 'grid');
      el.list.classList.toggle('list--index', state.view === 'index');
    };

    if (withMotion) animateReflow(apply); else apply();

    el.empty.hidden = list.length > 0;

    // the count is noise when nothing is filtered — show it only when it informs
    const filtered = state.q.trim() || state.collection !== 'all' || state.favsOnly;
    el.count.textContent = filtered && list.length
      ? `${list.length} ${list.length === 1 ? 'result' : 'results'}` : '';

    el.chips.querySelectorAll('.chip').forEach((c) => {
      c.setAttribute('aria-selected', String(c.dataset.id === state.collection));
    });
    el.segs.forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.view === state.view));
    });
    el.favBtn.setAttribute('aria-pressed', String(state.favsOnly));
    el.qClear.hidden = !state.q;

    requestAnimationFrame(placeTooltips);
  }

  function renderChips() {
    el.chips.innerHTML = COLLECTIONS.map((c) =>
      `<button class="chip" type="button" role="tab" data-id="${esc(c.id)}"
         aria-selected="${state.collection === c.id}">${esc(c.label)}</button>`
    ).join('');
  }

  /* --------------------------------------------------------------- theme -- */
  /* Ink is the default for everyone; the OS preference is deliberately not
     consulted. See the note on the inline script in index.html. */
  const THEME_CHROME = { dark: '#29221D', light: '#F5EDE1' };

  function applyTheme(theme, persist) {
    document.documentElement.dataset.theme = theme;
    el.themeBtn.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Switch to paper theme' : 'Switch to ink theme'
    );
    // Keep the browser chrome (address bar, status bar) with the page rather
    // than leaving it on whatever the first paint happened to be.
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_CHROME[theme]);
    if (persist) store.write(THEME_KEY, theme);
  }

  /* ------------------------------------------------------------- events -- */
  let t;
  el.q.addEventListener('input', (e) => {
    clearTimeout(t);
    const v = e.target.value;
    t = setTimeout(() => { state.q = v; render(); }, 90);
  });

  el.q.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { el.q.value = ''; state.q = ''; render(); el.q.blur(); }
  });

  el.qClear.addEventListener('click', () => {
    el.q.value = ''; state.q = ''; render(); el.q.focus();
  });

  el.chips.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    state.collection = chip.dataset.id;
    render();
  });

  el.segs.forEach((btn) => btn.addEventListener('click', () => {
    if (state.view === btn.dataset.view) return;
    state.view = btn.dataset.view;
    store.write(VIEW_KEY, state.view);
    render();
  }));

  el.favBtn.addEventListener('click', () => { state.favsOnly = !state.favsOnly; render(); });

  el.themeBtn.addEventListener('click', () => {
    applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', true);
  });

  el.reset?.addEventListener('click', () => {
    state.q = ''; el.q.value = '';
    state.collection = 'all';
    state.favsOnly = false;
    render();
    el.q.focus();
  });

  // saving is delegated, so it keeps working across every reorder
  el.list.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-fav]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();

    const id = btn.dataset.fav;
    const nowSaved = !state.favs.has(id);
    nowSaved ? state.favs.add(id) : state.favs.delete(id);
    store.write(FAV_KEY, JSON.stringify([...state.favs]));

    const site = SITES.find((s) => s.id === id);
    btn.setAttribute('aria-pressed', String(nowSaved));
    btn.setAttribute('aria-label',
      `${nowSaved ? 'Remove from' : 'Add to'} saved: ${site ? site.name : id}`);

    // Re-triggerable: a rapid double-click must replay, not sit dead because
    // the class is technically still applied from the previous press.
    btn.classList.remove('star--pop');
    void btn.offsetWidth;
    btn.classList.add('star--pop');

    if (state.favsOnly) render();     // the item may need to leave the list
  });

  /* Keyboard: "/" jumps to search from anywhere; arrows walk the list. The
     arrow step is measured from the live layout rather than assumed, because
     the column count is responsive and the index view is a single column. */
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) {
      e.preventDefault();
      el.q.focus(); el.q.select();
      return;
    }

    if (!e.key.startsWith('Arrow') || e.metaKey || e.ctrlKey || e.altKey) return;

    const items = [...el.list.children];
    if (!items.length) return;

    const here = items.indexOf(document.activeElement.closest('.item'));
    if (here === -1) return;

    // Column count is read from the live layout, not assumed: the grid is
    // responsive and the index view is always a single column.
    const topRow = items.filter((n) => n.offsetTop === items[0].offsetTop).length;
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -topRow, ArrowDown: topRow }[e.key];
    if (step === undefined) return;

    // A "soon" item renders its overlay as a <span>, which cannot take focus.
    // Landing on one would silently strand the caret, so keep travelling in
    // the same direction until something focusable turns up.
    for (let i = here + step; i >= 0 && i < items.length; i += step) {
      const link = items[i].querySelector('a.item__link');
      if (!link) continue;
      e.preventDefault();
      link.focus();
      return;
    }
  });

  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(placeTooltips, 120); });

  /* ---------------------------------------------------------------- boot -- */
  applyTheme(document.documentElement.dataset.theme || 'dark', false);
  renderChips();
  render(false);            // first paint uses the CSS entrance, not FLIP
  [...el.list.children].forEach((n, i) => {
    n.style.animationDelay = Math.min(i * 26, 300) + 'ms';
    n.classList.add('item--enter');
  });
})();
