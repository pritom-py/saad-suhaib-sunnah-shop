/**
 * Builds derived storefront artwork from the ORIGINAL client photographs.
 * Originals in public/products and public/logo are never modified.
 *
 *   node scripts/build-assets.cjs
 *
 * Outputs:
 *   public/products/clean/*.jpg   cropped copies without price bubbles / camera watermarks
 *   public/logo/logo-circle.png   the real logo with its black backdrop made transparent
 *   public/hero/hero-products.webp  composite traced from real product photos
 *   public/hero/hero-scene.webp     decorative dusk-mosque backdrop + wooden platform (illustration)
 */
const path = require("path");
const fs = require("fs");
const sharp = require(
  require.resolve("sharp", { paths: [path.dirname(require.resolve("next/package.json"))] })
);

const ROOT = path.join(__dirname, "..", "public");
const SRC = path.join(ROOT, "products");
const OUT = path.join(SRC, "clean");
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(path.join(ROOT, "hero"), { recursive: true });

const svg = (w, h, body) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${body}</svg>`);

/* ------------------------------------------------------------------ */
/* 1. Product crops. Values are fractions: [left, top, right, bottom] */
/* ------------------------------------------------------------------ */
const CROPS = {
  "original-kalo-vip-haji-rumal": [0.05, 0.04, 0.97, 0.69],
  "imatore-tupi": [0.13, 0.015, 0.85, 0.505],
  "makra-tupi": [0.06, 0.1, 0.94, 0.84],
  "normal-ac-tupi": [0.0, 0.01, 0.8, 0.74],
  "qawmi-uchu-tupi": [0.07, 0.0, 0.93, 0.645],
  "qawmi-tupi-asol": [0.06, 0.1, 0.94, 0.82],
  "fitting-bandha-pagri": [0.035, 0.22, 0.62, 0.635],
  "afghan-pagri": [0.22, 0.04, 0.88, 0.98],
  "digital-tasbih": [0.21, 0.455, 0.99, 0.975],
  "quraner-gilaf": [0.13, 0.0, 0.655, 1.0],
  "double-embroidery-ac-tupi-alt": [0.02, 0.305, 0.98, 0.895],
  "double-embroidery-ac-tupi": [0.02, 0.315, 0.98, 0.895],
  "padma-tupi": [0.2, 0.28, 0.82, 0.99],
  "2-number-insaf-tupi": [0.02, 0.27, 0.92, 0.89],
  "bangla-kashmiri-rumal": [0.08, 0.25, 0.82, 0.745],
  "noor-hosen-rumal": [0.04, 0.31, 0.93, 0.84],
  "javed-jafar-rumal": [0.01, 0.31, 0.99, 0.99],
  "japani-tore-tupi": [0.005, 0.515, 0.32, 0.86],
  "chikon-sutar-jali-tupi": [0.236, 0.005, 0.494, 0.42],
  "packet-miswak": [0.03, 0.02, 0.97, 0.588],
  "packet-olive-miswak": [0.02, 0.285, 0.98, 0.96],
  "palestinian-rumal": [0.02, 0.395, 0.98, 0.975],
};

/**
 * Where a price bubble sits purely over BACKGROUND next to the product, a strip of
 * the same photo's background is copied over it. Product pixels are never touched.
 * { to: [l,t,r,b], from: [l,t], mirror }
 */
const BACKGROUND_PATCHES = {
  "makra-tupi": { to: [0.675, 0.0, 1.0, 0.236], from: [0.0, 0.0] },
  "qawmi-tupi-asol": { to: [0.65, 0.0, 1.0, 0.392], from: [0.0, 0.0], mirror: true },
  "padma-tupi": { to: [0.0, 0.0, 0.385, 0.375], from: [0.615, 0.0], mirror: true },
};

async function loadSource(name) {
  const file = path.join(SRC, `${name}.jpg`);
  const { width, height } = await sharp(file).metadata();
  const patch = BACKGROUND_PATCHES[name];
  if (!patch) return { input: await sharp(file).toBuffer(), width, height };

  const [l, t, r, b] = patch.to;
  const w = Math.min(Math.round((r - l) * width), width - Math.round(l * width));
  const h = Math.round((b - t) * height);
  let strip = sharp(file).extract({
    left: Math.round(patch.from[0] * width),
    top: Math.round(patch.from[1] * height),
    width: w,
    height: h,
  });
  if (patch.mirror) strip = strip.flop();
  // feather the patch edges so the join does not show
  const f = Math.round(width * 0.008);
  const mask = await sharp(
    svg(w, h, `<rect x="${l > 0 ? f * 1.5 : -f * 3}" y="${-f * 3}" width="${w + (r < 1 ? -f * 1.5 : f * 3) - (l > 0 ? f * 1.5 : -f * 3)}" height="${h + f * 1.5}" fill="#fff"/>`)
  ).blur(Math.max(1, f * 0.6)).png().toBuffer();
  const patched = await strip.ensureAlpha().composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
  const input = await sharp(file)
    .composite([{ input: patched, left: Math.round(l * width), top: Math.round(t * height) }])
    .jpeg({ quality: 95 })
    .toBuffer();
  return { input, width, height };
}

async function buildCrops() {
  for (const [name, [l, t, r, b]] of Object.entries(CROPS)) {
    const { input, width, height } = await loadSource(name);
    await sharp(input)
      .extract({
        left: Math.round(l * width),
        top: Math.round(t * height),
        width: Math.floor((r - l) * width),
        height: Math.floor((b - t) * height),
      })
      .resize({ width: 1000, height: 1000, fit: "inside", withoutEnlargement: true })
      .modulate({ brightness: 1.04, saturation: 1.04 })
      .sharpen({ sigma: 0.6 })
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(path.join(OUT, `${name}.jpg`));
  }
}

/* ------------------------------------------------------------------ */
/* 2. Logo: original pixels, black backdrop removed                   */
/* ------------------------------------------------------------------ */
async function buildLogo() {
  const box = { left: 258, top: 15, width: 509, height: 496 };
  const mask = svg(box.width, box.height, `<ellipse cx="254.5" cy="248" rx="253" ry="246.5" fill="#fff"/>`);
  const cut = await sharp(path.join(ROOT, "logo", "logo.jpg"))
    .extract(box)
    .ensureAlpha()
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
  await sharp(cut).resize(512, 512, { fit: "fill" }).png().toFile(path.join(ROOT, "logo", "logo-circle.png"));
}

/* ------------------------------------------------------------------ */
/* 3. Hero composite from real photographs                            */
/* ------------------------------------------------------------------ */
async function cutout(name, points, { tint } = {}) {
  const file = path.join(SRC, `${name}.jpg`);
  const { width, height } = await sharp(file).metadata();
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const box = {
    left: Math.min(...xs),
    top: Math.min(...ys),
    width: Math.min(width, Math.max(...xs)) - Math.min(...xs),
    height: Math.min(height, Math.max(...ys)) - Math.min(...ys),
  };
  const mask = await sharp(
    svg(width, height, `<polygon points="${points.map((p) => p.join(",")).join(" ")}" fill="#fff" stroke="#fff" stroke-width="1" stroke-linejoin="round"/>`)
  ).blur(1.1).png().toBuffer();
  let base = sharp(file);
  if (tint) base = base.linear(tint.a, tint.b || [0, 0, 0]);
  const full = await base.ensureAlpha().composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
  return sharp(full).extract(box).png().toBuffer();
}

/** soft contact shadow built from a layer's own alpha */
async function shadowOf(buf, blur = 14, opacity = 0.55) {
  const { width, height } = await sharp(buf).metadata();
  const pad = blur * 3;
  const a = await sharp(buf).extractChannel("alpha").toColourspace("b-w").raw().toBuffer();
  const padded = await sharp(a, { raw: { width, height, channels: 1 } })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: "#000" })
    .toColourspace("b-w")
    .raw()
    .toBuffer({ resolveWithObject: true });
  const alpha = await sharp(padded.data, { raw: padded.info })
    .blur(blur)
    .linear(opacity, 0)
    .toColourspace("b-w")
    .raw()
    .toBuffer();
  const W = width + pad * 2;
  const H = height + pad * 2;
  const input = await sharp({ create: { width: W, height: H, channels: 3, background: "#140a02" } })
    .joinChannel(alpha, { raw: { width: W, height: H, channels: 1 } })
    .png()
    .toBuffer();
  return { input, pad };
}

/** a folded length of the real checked fabric: stacked layers with edge shading */
async function foldedFabric(region, w, layerH, layers) {
  const swatch = await sharp(path.join(SRC, "kalo-haji-rumal.jpg"))
    .extract(region)
    .resize(w, layerH, { fit: "fill" })
    .modulate({ brightness: 1.14, saturation: 0.7 })
    .linear([1.08, 1.04, 0.96], [4, 2, 0])
    .png()
    .toBuffer();
  const step = Math.round(layerH * 0.62);
  const H = layerH + step * (layers - 1);
  const comps = [];
  for (let i = 0; i < layers; i++) {
    const inset = (layers - 1 - i) * 9;
    const lw = w - inset * 2;
    const r = layerH * 0.42;
    const layer = await sharp(swatch)
      .resize(lw, layerH, { fit: "fill" })
      .ensureAlpha()
      .composite([
        {
          input: svg(lw, layerH, `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#1a0d00" stop-opacity=".55"/></linearGradient></defs><rect width="${lw}" height="${layerH}" fill="url(#g)"/>`),
          blend: "atop",
        },
        { input: svg(lw, layerH, `<rect width="${lw}" height="${layerH}" rx="${r}" ry="${r}" fill="#fff"/>`), blend: "dest-in" },
      ])
      .png()
      .toBuffer();
    comps.push({ input: layer, left: inset, top: i * step });
  }
  return sharp({ create: { width: w, height: H, channels: 4, background: "#0000" } }).composite(comps).png().toBuffer();
}

async function buildHeroProducts() {
  const W = 1600;
  const H = 840;
  const place = [];
  const add = async (buf, left, top, shadow = true) => {
    if (shadow) {
      const s = await shadowOf(buf);
      place.push({ input: s.input, left: Math.round(left - s.pad + 8), top: Math.round(top - s.pad + 12) });
    }
    place.push({ input: buf, left: Math.round(left), top: Math.round(top) });
  };
  const sized = (buf, width) => sharp(buf).resize({ width }).png().toBuffer();

  // Packaged VIP Haji rumal, upright at the back right (price bubble excluded by the outline)
  const packet = await cutout(
    "original-kalo-vip-haji-rumal",
    [[205, 138], [300, 108], [720, 116], [1130, 140], [1385, 150], [1420, 205], [1500, 760], [1500, 1000], [1452, 1432], [900, 1462], [628, 1468], [612, 1235], [500, 1052], [140, 1038], [40, 1046], [4, 985], [95, 560], [190, 165]],
    { tint: { a: [1.2, 1.16, 1.08] } }
  );
  await add(await sized(packet, 650), 918, 130);

  // Stacked white AC caps
  const ac = await cutout(
    "normal-ac-tupi",
    [[10, 118], [30, 76], [80, 48], [150, 29], [260, 26], [380, 40], [480, 62], [558, 98], [596, 138], [596, 185], [586, 232], [590, 282], [578, 336], [532, 376], [452, 399], [370, 408], [280, 405], [200, 395], [122, 376], [57, 340], [25, 290], [10, 202]],
    { tint: { a: [1.08, 1.045, 0.93], b: [2, 0, -5] } }
  );
  await add(await foldedFabric({ left: 300, top: 1150, width: 520, height: 290 }, 590, 132, 3), 505, 512);
  await add(await sized(ac, 555), 515, 262);
  await add(await sized(ac, 505), 540, 70);

  // Crochet cap, front left
  const guti = await cutout(
    "guti-tupi",
    [[12, 495], [30, 428], [72, 348], [122, 290], [168, 256], [232, 224], [304, 208], [402, 204], [482, 216], [560, 242], [628, 290], [678, 368], [702, 450], [701, 560], [688, 658], [662, 748], [628, 798], [558, 838], [470, 864], [370, 868], [272, 855], [182, 830], [102, 780], [42, 710], [12, 608]],
    { tint: { a: [1.07, 1.04, 0.96] } }
  );
  await add(await sized(guti, 500), 55, 270);

  // Folded fabric in front
  await add(await foldedFabric({ left: 270, top: 1030, width: 600, height: 170 }, 640, 82, 2), 195, 683);

  // Red digital tasbih with compass
  const tasbih = await cutout(
    "digital-tasbih",
    [[1153, 946], [1176, 900], [1228, 877], [1300, 885], [1345, 920], [1357, 966], [1383, 1012], [1376, 1070], [1346, 1130], [1300, 1200], [1252, 1290], [1217, 1336], [1186, 1342], [1162, 1312], [1170, 1230], [1193, 1142], [1172, 1065], [1153, 1002]],
    { tint: { a: [1.45, 1.22, 1.14], b: [6, 3, 2] } }
  );
  const upright = await sharp(tasbih).rotate(-7, { background: "#0000" }).png().toBuffer();
  await add(await sharp(upright).resize({ height: 425 }).png().toBuffer(), 1035, 395);

  await sharp({ create: { width: W, height: H, channels: 4, background: "#0000" } })
    .composite(place)
    .png()
    .toBuffer()
    .then((b) => sharp(b).webp({ quality: 90, alphaQuality: 95 }).toFile(path.join(ROOT, "hero", "hero-products.webp")));
}

/* ------------------------------------------------------------------ */
/* 4. Decorative backdrop (illustration, no product content)          */
/* ------------------------------------------------------------------ */
async function buildScene() {
  const W = 1200;
  const H = 640;
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  const dome = (cx, base, r) =>
    `M${cx - r},${base} C${cx - r * 1.12},${base - r * 0.75} ${cx - r * 0.35},${base - r * 0.95} ${cx},${base - r * 1.55} C${cx + r * 0.35},${base - r * 0.95} ${cx + r * 1.12},${base - r * 0.75} ${cx + r},${base}Z`;
  const minaret = (x, top, w) =>
    `<rect x="${x - w / 2}" y="${top + 40}" width="${w}" height="${470 - top}" /><rect x="${x - w}" y="${top + 120}" width="${w * 2}" height="10"/><rect x="${x - w}" y="${top + 230}" width="${w * 2}" height="10"/><path d="${dome(x, top + 44, w * 0.75)}"/><rect x="${x - 1.5}" y="${top - 6}" width="3" height="24"/>`;

  const sky = `<defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14304a"/><stop offset=".42" stop-color="#4b5560"/><stop offset=".68" stop-color="#b9833f"/><stop offset="1" stop-color="#53381b"/></linearGradient>
    <radialGradient id="glow" cx=".33" cy=".62" r=".55"><stop offset="0" stop-color="#ffd27a" stop-opacity=".85"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#sky)"/><rect width="${W}" height="${H}" fill="url(#glow)"/>`;

  const mosque = `<g transform="translate(105 0)"><g fill="#16261f">
    ${minaret(292, 45, 24)}${minaret(96, 190, 16)}
    <path d="${dome(185, 330, 86)}"/><rect x="92" y="328" width="190" height="150"/>
    <path d="${dome(102, 385, 40)}"/><path d="${dome(268, 385, 40)}"/><rect x="40" y="384" width="330" height="110"/>
    ${minaret(1035, 120, 18)}<path d="${dome(955, 370, 62)}"/><rect x="885" y="368" width="200" height="120"/></g>
    <g fill="#1d6a55" opacity=".9"><path d="${dome(185, 330, 82)}"/></g>
    <g fill="#ffcd6b">${Array.from({ length: 16 }, (_, i) => `<path d="M${60 + i * 20},470 v-34 a6,9 0 0 1 12,0 v34z" opacity="${0.45 + rnd() * 0.5}"/>`).join("")}
    <rect x="283" y="170" width="18" height="22" opacity=".9"/></g>
    <g fill="#10211a">${Array.from({ length: 70 }, () => `<circle cx="${rnd() * 560}" cy="${462 + rnd() * 45}" r="${14 + rnd() * 30}"/>`).join("")}</g></g>`;

  const bokeh = Array.from({ length: 80 }, () => {
    const x = rnd() * W;
    const y = 300 + rnd() * 220;
    return `<circle cx="${x}" cy="${y}" r="${2 + rnd() * 9}" fill="#ffdc8a" opacity="${0.12 + rnd() * 0.5}"/>`;
  }).join("");

  // stone arch of the building the products are standing in, soft and out of focus
  const stone = `<path d="M${W},0 H520 C640,18 690,60 700,120 C760,60 900,40 1010,110 C1080,160 1100,260 1096,${H} H${W}Z" fill="#6d4b2a" opacity=".78"/>
    <path d="M700,120 C760,60 900,40 1010,110 C1080,160 1100,260 1096,${H}" fill="none" stroke="#d9a95b" stroke-width="16" opacity=".55"/>`;

  const bg = await sharp(svg(W, H, sky + mosque)).blur(3.2).png().toBuffer();
  const soft = await sharp(svg(W, H, bokeh + stone)).blur(5).png().toBuffer();

  const grain = Array.from({ length: 85 }, () => {
    const y = 505 + rnd() * 135;
    const x = rnd() * W - 200;
    const len = 200 + rnd() * 600;
    return `<path d="M${x},${y} q${len / 2},${rnd() * 8 - 4} ${len},${rnd() * 6 - 3}" stroke="${rnd() > 0.5 ? "#3d200b" : "#d39a5c"}" stroke-width="${0.6 + rnd() * 2}" fill="none" opacity="${0.18 + rnd() * 0.35}"/>`;
  }).join("");
  const table = `<defs><linearGradient id="wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b97a40"/><stop offset=".6" stop-color="#8a5326"/><stop offset="1" stop-color="#4e2b10"/></linearGradient></defs>
    <rect y="500" width="${W}" height="140" fill="url(#wood)"/>${grain}<rect y="500" width="${W}" height="4" fill="#ffdca0" opacity=".75"/><rect y="608" width="${W}" height="3" fill="#2a1505" opacity=".7"/><rect y="611" width="${W}" height="29" fill="#2a1505" opacity=".35"/>`;
  const wood = await sharp(svg(W, H, table)).png().toBuffer();

  await sharp(bg)
    .composite([{ input: soft }, { input: wood }])
    .webp({ quality: 88 })
    .toFile(path.join(ROOT, "hero", "hero-scene.webp"));
}

/* ------------------------------------------------------------------ */
/* 5. Category card photographs (squarer, tighter crops)              */
/* ------------------------------------------------------------------ */
const CATEGORY_CROPS = {
  caps: ["padma-tupi", [0.23, 0.285, 0.79, 1.0]],
  turbans: ["fitting-bandha-pagri", [0.035, 0.27, 0.43, 0.645]],
  scarves: ["bangla-kashmiri-rumal", [0.1, 0.405, 0.8, 0.8]],
  tasbih: ["digital-tasbih", [0.43, 0.47, 0.99, 0.99]],
  "quran-covers": ["quraner-gilaf", [0.14, 0.0, 0.65, 1.0]],
};
async function buildCategoryImages() {
  const dir = path.join(ROOT, "categories");
  fs.mkdirSync(dir, { recursive: true });
  for (const [slug, [name, [l, t, r, b]]] of Object.entries(CATEGORY_CROPS)) {
    const { input, width, height } = await loadSource(name);
    await sharp(input)
      .extract({ left: Math.round(l * width), top: Math.round(t * height), width: Math.floor((r - l) * width), height: Math.floor((b - t) * height) })
      .resize({ width: 700, height: 700, fit: "inside", withoutEnlargement: true })
      .modulate({ brightness: 1.06, saturation: 1.05 })
      .sharpen({ sigma: 0.6 })
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(path.join(dir, `${slug}.jpg`));
  }
}

(async () => {
  await buildCrops();
  await buildCategoryImages();
  await buildLogo();
  await buildHeroProducts();
  await buildScene();
  console.log("Assets built:", Object.keys(CROPS).length, "product crops, logo, hero composite, hero scene");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
