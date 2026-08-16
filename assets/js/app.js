/* =============================================================================
 *  app.js — rendering, search, filtering, saved items.
 *  No framework, no build step. Reads COLLECTIONS + SITES from data.js.
 * =========================================================================== */
(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const FAV_KEY = 'zibaldone.favs.v1';

  /** localStorage throws in private mode / embedded webviews. Never let it break the page. */
  const store = {
    get() {
      try { return new Set(JSON.parse(localStorage.getItem(FAV_KEY)) || []); }
      catch { return new Set(); }
    },
    set(set) {
      try { localStorage.setItem(FAV_KEY, JSON.stringify([...set])); }
      catch { /* ignore */ }
    },
  };

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  /* --------------------------------------------------------------- state -- */
  const state = {
    q: '',
    collection: 'mine',
    favsOnly: false,
    favs: store.get(),
  };

  const el = {
    q:      $('#q'),
    qClear: $('#qClear'),
    chips:  $('#chips'),
    grid:   $('#grid'),
    count:  $('#count'),
    empty:  $('#empty'),
    favBtn: $('#favBtn'),
    reset:  $('#resetBtn'),
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

  /* ------------------------------------------------------------- markup --- */
  const ICON_EXT =
    '<svg class="card__ext" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M7.5 16.5L16.5 7.5M9 7.5h7.5V15" fill="none" stroke="currentColor" ' +
    'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const ICON_STAR =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.4l2.4 4.87 5.37.78-3.89 ' +
    '3.79.92 5.36L12 16.66l-4.8 2.54.92-5.36-3.89-3.79 5.37-.78z" fill="none" ' +
    'stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>';

  function cardHTML(site, i) {
    const live  = site.url && site.url !== '#' && site.status !== 'soon' && site.status !== 'wip';
    const faved = state.favs.has(site.id);

    const meta = [...(site.tags || []), live ? null : 'Soon']
      .filter(Boolean).map(esc).join(' · ');

    const link = live
      ? `<a class="card__link" href="${esc(site.url)}" target="_blank" rel="noopener noreferrer"
            aria-label="${esc(site.name)} — ${esc(site.desc || '')}"></a>`
      : `<span class="card__link" aria-hidden="true"></span>`;

    return `
      <article class="card${live ? '' : ' card--soon'}"
               data-collection="${esc(site.collection)}"
               style="animation-delay:${Math.min(i * 26, 300)}ms">
        ${link}
        <div class="card__body">
          <h2 class="card__title">${esc(site.name)}</h2>
          <p class="card__meta">${meta}</p>
          <p class="tip" role="tooltip">${esc(site.desc || '')}</p>
        </div>
        <div class="card__aside">
          ${live ? ICON_EXT : ''}
          <button class="star" type="button" data-fav="${esc(site.id)}"
                  aria-pressed="${faved}"
                  aria-label="${faved ? 'Remove from' : 'Add to'} saved: ${esc(site.name)}"
                  >${ICON_STAR}</button>
        </div>
      </article>`;
  }

  /* -------------------------------------------------------------- render -- */
  function renderChips() {
    el.chips.innerHTML = COLLECTIONS.map((c) =>
      `<button class="chip" type="button" role="tab" data-id="${c.id}"
         aria-selected="${state.collection === c.id}">${esc(c.label)}</button>`
    ).join('');
  }

  /* Cards on the top row have nothing above them — their tooltip would sit
     off-screen, so it flips underneath instead. Recomputed on every render
     and on resize, because the column count changes with the viewport. */
  function placeTooltips() {
    const cards = [...el.grid.children];
    if (!cards.length) return;
    const top = Math.min(...cards.map((c) => c.offsetTop));
    cards.forEach((c) => c.classList.toggle('card--flip', c.offsetTop === top));
  }

  function render() {
    // newest first — a new site with a later `added` date takes the front
    // row automatically, pushing everything else one step back.
    const list = SITES.filter(matches)
      .sort((a, b) => (b.added || '').localeCompare(a.added || ''));

    el.grid.innerHTML = list.map(cardHTML).join('');
    el.empty.hidden = list.length > 0;

    // the count is noise when nothing is filtered — only show it when it informs
    const filtered = state.q.trim() || state.collection !== 'all' || state.favsOnly;
    el.count.textContent = filtered && list.length
      ? `${list.length} ${list.length === 1 ? 'result' : 'results'}` : '';

    el.chips.querySelectorAll('.chip').forEach((c) => {
      c.setAttribute('aria-selected', String(c.dataset.id === state.collection));
    });
    el.favBtn.setAttribute('aria-pressed', String(state.favsOnly));
    el.qClear.hidden = !state.q;

    requestAnimationFrame(placeTooltips);
  }

  /* -------------------------------------------------------------- events -- */
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

  el.favBtn.addEventListener('click', () => { state.favsOnly = !state.favsOnly; render(); });

  el.reset?.addEventListener('click', () => {
    state.q = ''; el.q.value = '';
    state.collection = 'all';
    state.favsOnly = false;
    render();
  });

  // saving is delegated so it survives re-renders
  el.grid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-fav]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();

    const id = btn.dataset.fav;
    state.favs.has(id) ? state.favs.delete(id) : state.favs.add(id);
    store.set(state.favs);

    btn.setAttribute('aria-pressed', String(state.favs.has(id)));

    if (state.favsOnly) render();     // the card may need to disappear
  });

  // "/" focuses search from anywhere
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) {
      e.preventDefault();
      el.q.focus(); el.q.select();
    }
  });

  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(placeTooltips, 120); });

  /* ---------------------------------------------------------------- boot -- */
  renderChips();
  render();
})();
