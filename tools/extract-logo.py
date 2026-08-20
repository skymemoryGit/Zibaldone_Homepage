"""
Rebuilds the emblem assets from the original logo PNG.

The source (tools/logo-source.png) is a flat picture: cream artwork on a solid
#29221D field with a faint grid ruling printed over it. Pasting that rectangle
onto the page would show its edges the moment the theme changed, so instead we
turn the artwork into a MASK — how far each pixel travels from the background
toward the cream — and repaint it in whichever colour the theme needs.

That is also why the grid ruling has to be cut: it deviates from the field by
only a few levels, so a low alpha floor removes it cleanly while leaving the
soft edges of the feather intact.

Run from the repo root:   python "rework total/tools/extract-logo.py"
"""
from PIL import Image
import os

HERE = os.path.dirname(os.path.abspath(__file__))
IMG  = os.path.join(HERE, '..', 'assets', 'img')

BG    = (0x29, 0x22, 0x1D)   # sampled: 75.6% of the source pixels
CREAM = (0xEF, 0xD3, 0xB5)   # sampled: the quill
TOP, BOT = 88, 352           # the emblem; the ZIBALDONE lettering (371..421)
                             # is left out on purpose — the page sets the name
                             # as live text, not as a second image.
ALPHA_FLOOR = 0.07           # below this it is the printed grid, not artwork

src = Image.open(os.path.join(HERE, 'logo-source.png')).convert('RGB')
w, h = src.size
px = src.load()

val = lambda c: (c[0] + c[1] + c[2]) / 3.0
bgv, crv = val(BG), val(CREAM)

xs = [x for x in range(w) for y in range(TOP, BOT) if val(px[x, y]) - bgv > 22]
L, R = min(xs) - 6, max(xs) + 7


def extract(tint, name):
    im = Image.new('RGBA', (R - L, BOT - TOP), (0, 0, 0, 0))
    o = im.load()
    for y in range(TOP, BOT):
        for x in range(L, R):
            a = (val(px[x, y]) - bgv) / (crv - bgv)
            if a < ALPHA_FLOOR:
                continue
            a = min(1.0, a)
            o[x - L, y - TOP] = tint + (int(round(a * 255)),)
    im.save(os.path.join(IMG, name))
    return im


ink = extract((0xEF, 0xD3, 0xB5), 'logo-mark.png')        # on the ink theme
extract((0x3A, 0x2E, 0x24), 'logo-mark-paper.png')        # on the paper theme

side = max(ink.size) + 16
fav = Image.new('RGBA', (side, side), (0, 0, 0, 0))
fav.paste(ink, ((side - ink.size[0]) // 2, (side - ink.size[1]) // 2), ink)
for s in (180, 32):
    fav.resize((s, s), Image.LANCZOS).save(os.path.join(IMG, 'favicon-%d.png' % s))

print('emblem %dx%d -> logo-mark.png, logo-mark-paper.png, favicon-180/32.png'
      % ink.size)
