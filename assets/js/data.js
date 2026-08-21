/* =============================================================================
 *  data.js — the single source of truth for every card on zibaldone.ch
 * =============================================================================
 *
 *  To add a site, append an object to SITES. Nothing else needs to change —
 *  the grid sorts itself by `added`, newest first.
 *
 *  Schema
 *  ------
 *  id          {string}   unique slug, lowercase-with-dashes. Used for saved
 *                         items (localStorage), so DO NOT rename it later or
 *                         people lose their stars.
 *  name        {string}   card title.
 *  url         {string}   destination. Use "#" for a not-yet-live placeholder.
 *  desc        {string}   one short phrase, ~8–10 words. Appears in the hover
 *                         tooltip (desktop) / as a second line (touch).
 *                         Say what it DOES, not why it is good.
 *  tags        {string[]} 1–3 short tags, rendered as the small meta line.
 *  collection  {string}   "mine" | "picks"   -> drives the filter chips.
 *  status      {string}   (optional) "live" | "wip" | "soon".  Default: "live".
 *                         Anything but "live" dims the title, appends "Soon"
 *                         to the meta line and disables the link.
 *  added       {string}   ISO date "YYYY-MM-DD". Drives sort order — the grid
 *                         always shows newest first. A new site with a later
 *                         date takes the front row automatically; nothing
 *                         else needs to change.
 * =========================================================================== */

const COLLECTIONS = [
  { id: 'mine',  label: 'Made by JYe' },
  { id: 'picks', label: 'Picks by JYe' },
  { id: 'all',   label: 'All' },
];

const SITES = [
  /* ---------------------------------------------------------------- mine -- */
  {
    id: 'pranzo-mclaren-roulette',
    name: 'Pranzo McLaren Roulette',
    url: 'https://pranzo.zibaldone.ch/',
    desc: 'Spins a wheel to decide what’s for lunch.',
    tags: ['Fun', 'Tool'],
    collection: 'mine',
    added: '2026-07-20',
  },
  {
    id: 'vpchess',
    name: 'VPChess',
    url: 'https://chess.zibaldone.ch/',
    desc: 'Play, review and share chess positions in the browser.',
    tags: ['Game', 'Chess'],
    collection: 'mine',
    added: '2026-07-28',
  },
  {
    id: 'ravioli-milano',
    name: 'Ravioli Milano',
    url: 'https://ravioli.zibaldone.ch/',
    desc: 'A restaurant website with menu, story and reservations.',
    tags: ['Client', 'Web'],
    collection: 'mine',
    added: '2026-08-05',
  },
  {
    id: 'tapvision',
    name: 'TapVision',
    url: '#',
    desc: 'The project behind these small, fast-shipped experiments.',
    tags: ['Project', 'SaaS'],
    collection: 'mine',
    status: 'wip',
    added: '2026-08-15',
  },

  /* --------------------------------------------------------------- picks -- */
  {
    id: 'musclewiki',
    name: 'MuscleWiki',
    url: 'https://musclewiki.com/',
    desc: 'Click a muscle, get animated exercises for it.',
    tags: ['Fitness', 'Reference'],
    collection: 'picks',
    added: '2026-08-15',
  },
  {
    id: 'keepscreenon',
    name: 'Keep Screen On',
    url: 'https://www.keepscreenon.com/',
    desc: 'Keeps your screen awake, no install, no settings.',
    tags: ['Utility'],
    collection: 'picks',
    added: '2026-08-15',
  },
  {
    id: 'drivefromhome',
    name: 'Drive From Home',
    url: 'https://drivefromhome.com/city/',
    desc: 'A calm virtual drive through real city streets.',
    tags: ['Relax', 'Map'],
    collection: 'picks',
    added: '2026-08-15',
  },
  {
    id: 'slowroads',
    name: 'Slow Roads',
    url: 'https://slowroads.io/',
    desc: 'An endless procedurally generated road, in your browser.',
    tags: ['Relax', 'Game'],
    collection: 'picks',
    added: '2026-08-15',
  },
  {
    id: 'episodely',
    name: 'Episodely',
    url: 'https://episodely.tv/',
    desc: 'Tracks shows and movies you have watched, with discussions.',
    tags: ['Tracker', 'TV'],
    collection: 'picks',
    added: '2026-08-21',
  },
];
