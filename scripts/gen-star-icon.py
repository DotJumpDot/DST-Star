#!/usr/bin/env python3
"""Generate the DST-Star icon (family template: rounded night tile, v2 blue).

Third tile in the DST family, same construction as dst-moon.ico /
dst-comet.ico: rounded-square gradient night tile, thin border, glow behind
the body, crisp body, sparkle stars. V2 after user feedback (2026-11-01):
the star is a proper BLUE (ice-blue core #CFE8FF -> star-blue limb #3E7BC8)
on a deeper navy tile, with a two-layer aura — a tight bright halo plus a
wide soft bloom — so the star reads as glowing (Moon is the gold tile,
Comet the pink one, Star the blue one).

Run: python scripts/gen-star-icon.py [out.ico]
Writes assets/dst-star.ico (7 sizes 16-256) + assets/dst-star.png (256).
"""
import os
import sys

from PIL import Image, ImageDraw, ImageFilter

SZ = 512  # draw at 512, downscale for crisp small sizes
TILE = (24, 24, SZ - 24, SZ - 24)
RADIUS = 96

BG_TOP = (15, 21, 38)       # deep navy night
BG_BOTTOM = (24, 33, 58)    # navy, lighter
BORDER = (58, 76, 106)      # steel-blue border
BODY_CORE = (207, 232, 255)  # ice-blue luminous core
BODY_EDGE = (62, 123, 200)   # star-blue limb
GLOW_INNER = (120, 180, 245)  # tight bright halo
GLOW_OUTER = (70, 130, 220)   # wide soft bloom
SPARK_W = (215, 235, 255)
SPARK_B = (140, 190, 245)


def star_points(cx, cy, r_out, r_in, rot=-90.0):
    import math
    pts = []
    for i in range(10):
        r = r_out if i % 2 == 0 else r_in
        a = math.radians(rot + i * 36.0)
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return pts


def rounded_tile_mask(sz):
    m = Image.new('L', (sz, sz), 0)
    ImageDraw.Draw(m).rounded_rectangle(TILE, radius=RADIUS, fill=255)
    return m


def build():
    # --- tile: vertical gradient clipped to the rounded mask
    grad = Image.new('RGB', (SZ, SZ))
    for y in range(SZ):
        t = y / (SZ - 1)
        c = tuple(int(BG_TOP[i] + (BG_BOTTOM[i] - BG_TOP[i]) * t) for i in range(3))
        ImageDraw.Draw(grad).line([(0, y), (SZ, y)], fill=c)
    icon = Image.new('RGBA', (SZ, SZ), (0, 0, 0, 0))
    icon.paste(grad, (0, 0), rounded_tile_mask(SZ))

    cx, cy = SZ // 2, SZ // 2 + 14

    # --- aura, outer layer: WIDE radial bloom (even circle, not star-shaped,
    # so it reads between the arms and out to the tile edge)
    R_BLOOM = 240
    bloom = Image.new('RGBA', (SZ, SZ), (0, 0, 0, 0))
    bd = ImageDraw.Draw(bloom)
    for rr in range(R_BLOOM, 0, -3):
        a = int(140 * (1 - rr / R_BLOOM) ** 1.2)  # gentle tail: the aura must reach the tile edge
        bd.ellipse((cx - rr, cy - rr, cx + rr, cy + rr), fill=GLOW_OUTER + (a,))
    bloom = bloom.filter(ImageFilter.GaussianBlur(10))
    icon.alpha_composite(bloom)
    icon.alpha_composite(bloom)  # double pass: the aura must READ at the border
    # --- aura, inner layer: star-shaped bright halo hugging the body
    halo = Image.new('RGBA', (SZ, SZ), (0, 0, 0, 0))
    ImageDraw.Draw(halo).polygon(star_points(cx, cy, 162, 65), fill=GLOW_INNER + (200,))
    halo = halo.filter(ImageFilter.GaussianBlur(18))
    icon.alpha_composite(halo)

    # --- body: crisp star with a vertical core->limb gradient
    body_box = Image.new('RGBA', (SZ, SZ), (0, 0, 0, 0))
    ImageDraw.Draw(body_box).polygon(star_points(cx, cy, 132, 53), fill=(255, 255, 255, 255))
    grad_body = Image.new('RGBA', (SZ, SZ), (0, 0, 0, 0))
    for y in range(SZ):
        t = y / (SZ - 1)
        c = tuple(int(BODY_CORE[i] + (BODY_EDGE[i] - BODY_CORE[i]) * t) for i in range(3))
        ImageDraw.Draw(grad_body).line([(0, y), (SZ, y)], fill=c + (255,))
    body = Image.composite(grad_body, Image.new('RGBA', (SZ, SZ), (0, 0, 0, 0)), body_box)
    icon.alpha_composite(body)

    # --- hot core glow: the star reads as glowing, not just painted
    core = Image.new('RGBA', (SZ, SZ), (0, 0, 0, 0))
    cd = ImageDraw.Draw(core)
    cr = 34
    for rr in range(cr, 0, -2):
        a = int(120 * (1 - rr / cr))
        cd.ellipse((cx - rr, cy - rr, cx + rr, cy + rr), fill=(235, 245, 255, a))
    icon.alpha_composite(core.filter(ImageFilter.GaussianBlur(6)))

    # --- sparkles: family style, blue-white four-point glints
    sd = ImageDraw.Draw(icon)
    for (sx, sy, s, col) in [
        (cx + 150, cy - 120, 15, SPARK_W),
        (cx - 155, cy + 66, 11, SPARK_B),
        (cx + 98, cy + 128, 9, SPARK_W),
        (cx - 92, cy - 138, 8, SPARK_B),
    ]:
        sd.polygon([(sx, sy - s), (sx + s * .32, sy - s * .32), (sx + s, sy),
                    (sx + s * .32, sy + s * .32), (sx, sy + s),
                    (sx - s * .32, sy + s * .32), (sx - s, sy),
                    (sx - s * .32, sy - s * .32)], fill=col + (235,))

    # --- border on top, clipped to the tile mask
    overlay = Image.new('RGBA', (SZ, SZ), (0, 0, 0, 0))
    ImageDraw.Draw(overlay).rounded_rectangle(TILE, radius=RADIUS, outline=BORDER + (255,), width=6)
    icon.alpha_composite(overlay)

    # clip everything back to the rounded tile (aura/edges stay inside)
    out = Image.new('RGBA', (SZ, SZ), (0, 0, 0, 0))
    out.paste(icon, (0, 0), rounded_tile_mask(SZ))
    return out


def main():
    here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    assets = os.path.join(here, 'assets')
    os.makedirs(assets, exist_ok=True)
    art = build()
    art.resize((256, 256), Image.LANCZOS).save(os.path.join(assets, 'dst-star.png'))
    ico_path = sys.argv[1] if len(sys.argv) > 1 else os.path.join(assets, 'dst-star.ico')
    art.resize((256, 256), Image.LANCZOS).save(
        ico_path, sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
    print('wrote', ico_path)


if __name__ == '__main__':
    main()
