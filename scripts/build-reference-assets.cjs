/**
 * Artwork for the approved homepage design.
 * Category, banner and about artwork uses the shop's own photographs (originals are never modified).
 * The carousel uses openly licensed cap photos from assets/stock as illustrative pictures.
 * The arches, mosque, lantern, stone stands and lighting are drawn illustrations.
 *
 *   node scripts/build-reference-assets.cjs
 */
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const sharp = require(require.resolve("sharp", { paths: [path.dirname(require.resolve("next/package.json"))] }));

const PUB = path.join(__dirname, "..", "public");
const SRC = path.join(PUB, "products");
const out = (...p) => {
  const file = path.join(PUB, ...p);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  return file;
};
const svg = (w, h, body) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${body}</svg>`);
const png = (w, h, body) => sharp(svg(w, h, body)).png().toBuffer();

/* ---------- product outlines, in original photo pixels ---------- */
const scale = (pts, k) => pts.map(([x, y]) => [Math.round(x * k), Math.round(y * k)]);
const SHAPES = {
  // single embroidered white cap
  embroidered: {
    file: "bangla-chicken-panch-kuli-tupi",
    pts: scale([[345,137],[420,135],[500,141],[560,151],[622,177],[682,217],[730,266],[763,320],[779,380],[794,430],[800,480],[806,560],[803,610],[784,662],[740,703],[680,733],[600,756],[500,771],[400,768],[300,750],[220,723],[150,693],[101,658],[78,614],[77,560],[82,500],[96,430],[121,356],[157,291],[206,227],[270,172],[312,147]], 1200 / 825),
    tint: { a: [1.035, 1.015, 0.97] },
  },
  // lace-net cap (padma)
  padma: {
    file: "padma-tupi",
    pts: scale([[299,570],[293,520],[285,450],[288,390],[301,330],[331,285],[376,251],[431,233],[500,227],[560,236],[614,256],[654,290],[684,335],[704,390],[711,450],[707,510],[694,549],[686,566],[640,598],[580,620],[500,626],[420,620],[355,603],[312,578]], 1.024),
    tint: { a: [1.12, 1.07, 0.97] },
  },
  // stack of white AC caps
  acStack: {
    file: "normal-ac-tupi",
    pts: [[10,118],[30,76],[80,48],[150,29],[260,26],[380,40],[480,62],[558,98],[596,138],[596,185],[586,232],[590,282],[578,336],[532,376],[452,399],[370,408],[280,405],[200,395],[122,376],[57,340],[25,290],[10,202]],
    tint: { a: [0.98, 0.965, 0.9], b: [-2, -3, -8] },
    saturation: 0.45,
  },
  // black & white haji rumal
  rumal: {
    file: "kalo-haji-rumal",
    pts: scale([[430,6],[462,3],[520,11],[559,60],[589,110],[619,200],[639,270],[667,330],[711,395],[749,470],[788,525],[786,758],[744,778],[738,800],[692,802],[692,860],[719,900],[742,950],[702,996],[690,962],[664,1010],[640,1048],[602,1097],[182,1097],[142,1050],[121,950],[101,880],[42,830],[17,790],[3,740],[8,690],[27,640],[42,580],[72,480],[102,400],[127,355],[167,300],[217,230],[257,221],[318,112],[346,60],[386,25]], 1147 / 789),
  },
  // pre-tied turbans
  turbans: {
    file: "fitting-bandha-pagri",
    pts: scale([[30,520],[45,450],[70,421],[140,406],[230,416],[290,440],[314,480],[344,600],[348,698],[262,706],[214,724],[190,788],[100,813],[29,788],[29,700]], 1341 / 923),
    tint: { a: [1.1, 1.08, 1.04] },
  },
  // zippered Quran covers
  covers: {
    file: "quraner-gilaf",
    pts: scale([[191,226],[212,214],[206,27],[217,15],[408,19],[430,16],[616,13],[624,26],[614,224],[627,233],[640,524],[629,539],[411,544],[399,531],[390,515],[378,527],[151,521],[143,507]], 1.6),
  },
  // caps traced from photos of people wearing them (only the cap is kept)
  makra: { file: "makra-tupi", pts: scale([[252,606],[229,560],[219,500],[216,440],[223,386],[246,331],[276,281],[321,239],[376,209],[441,196],[520,201],[590,216],[650,236],[704,269],[739,306],[764,346],[781,395],[793,430],[794,447],[769,469],[719,499],[640,539],[560,569],[470,591],[380,602],[300,609]], 1.5) },
  imatore: { file: "imatore-tupi", pts: scale([[261,384],[241,320],[231,240],[234,190],[256,136],[291,96],[341,61],[401,39],[470,29],[540,36],[599,61],[649,101],[688,151],[708,200],[714,250],[704,319],[695,353],[659,383],[600,413],[540,436],[470,446],[400,443],[331,426],[286,406]], 1151 / 989) },
  qawmi: { file: "qawmi-uchu-tupi", pts: scale([[197,362],[206,300],[229,231],[263,166],[306,121],[346,82],[421,56],[490,26],[530,21],[579,46],[628,81],[663,131],[688,200],[713,260],[733,320],[738,400],[733,459],[710,498],[660,513],[580,525],[490,528],[420,516],[341,483],[281,453],[231,418],[199,389]], 1438 / 989) },
  // packaged VIP haji rumal (price bubble excluded by the outline)
  vipPacket: { file: "original-kalo-vip-haji-rumal", pts: [[205,138],[300,108],[720,116],[1130,140],[1385,150],[1420,205],[1500,760],[1500,1000],[1452,1432],[900,1462],[628,1468],[612,1235],[500,1052],[140,1038],[40,1046],[4,985],[95,560],[190,165]], tint: { a: [1.14, 1.11, 1.05] } },
  // red digital tasbih with compass
  tasbih: {
    file: "digital-tasbih",
    pts: [[1153,946],[1176,900],[1228,877],[1300,885],[1345,920],[1357,966],[1383,1012],[1376,1070],[1346,1130],[1300,1200],[1252,1290],[1217,1336],[1186,1342],[1162,1312],[1170,1230],[1193,1142],[1172,1065],[1153,1002]],
    tint: { a: [1.45, 1.22, 1.14], b: [6, 3, 2] },
  },
};

/*
 * Openly licensed photos used ONLY in the homepage carousel (see src/content/image-credits.ts).
 * Outline points are in the coordinates of a preview `view` pixels wide.
 */
const STOCK = {
  stockBlue: { stock: "cap-blue-gold", view: 1100, pts: [[122,400],[135,355],[160,300],[195,235],[235,190],[290,150],[350,121],[420,102],[500,93],[560,94],[640,103],[710,125],[775,165],[825,215],[860,265],[875,320],[882,380],[884,440],[880,470],[866,520],[842,580],[810,625],[790,662],[768,700],[728,730],[660,755],[580,771],[500,774],[430,764],[370,744],[330,715],[298,690],[240,650],[190,600],[150,540],[126,480]] },
  stockOlive: { stock: "cap-olive-gold", view: 1100, pts: [[53,282],[70,246],[111,212],[180,176],[270,141],[380,113],[500,95],[620,89],[740,94],[850,111],[940,141],[1000,173],[1042,206],[1056,236],[1050,290],[1034,340],[1028,420],[1018,480],[1000,560],[975,630],[949,700],[914,790],[882,853],[828,893],[750,923],[650,942],[560,933],[470,918],[390,893],[320,853],[250,804],[190,749],[131,700],[81,665],[66,640],[60,560],[55,480],[52,380]] },
  stockMaroon: { stock: "cap-maroon", view: 1100, pts: [[16,600],[26,561],[61,506],[130,451],[190,406],[250,371],[330,343],[420,329],[500,326],[580,336],[624,351],[641,371],[649,420],[659,465],[674,510],[699,575],[721,640],[739,690],[741,715],[723,750],[688,809],[648,869],[599,913],[545,947],[470,938],[380,924],[290,913],[210,888],[151,858],[121,824],[96,789],[61,730],[31,680],[16,640]] },
  stockWhite: { stock: "caps-white-set", view: 1100, pts: [[542,250],[549,226],[576,196],[601,171],[626,136],[666,106],[715,86],[770,80],[829,92],[878,121],[913,161],[930,210],[938,250],[936,290],[918,334],[883,368],[849,393],[810,410],[760,416],[701,403],[656,383],[616,358],[587,329],[557,290]] },
  stockCream: { stock: "cap-cream-brown", view: 1100, pts: [[344,106],[361,86],[401,66],[460,49],[530,37],[600,33],[660,41],[709,57],[734,73],[738,95],[736,150],[740,220],[738,270],[732,298],[699,327],[660,352],[600,369],[540,382],[492,385],[479,372],[441,348],[401,332],[372,313],[362,280],[359,230],[349,160]] },
  stockCopper: { stock: "cap-brown-copper", view: 1088, pts: [[67,463],[111,421],[180,409],[300,399],[420,393],[560,385],[700,379],[820,375],[893,379],[938,406],[958,441],[988,490],[1013,545],[1028,600],[1038,660],[1053,715],[1060,763],[1038,783],[969,822],[880,862],[780,897],[680,931],[560,951],[486,954],[440,937],[340,912],[240,877],[150,842],[81,817],[10,801],[8,740],[14,660],[22,590],[37,520]] },
};

/** a closed smooth curve through the traced points, so cut edges are not faceted */
const smooth = (pts) => {
  const at = (i) => pts[(i + pts.length) % pts.length];
  let d = `M${at(0)[0]},${at(0)[1]}`;
  for (let i = 0; i < pts.length; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
  }
  return d + "Z";
};

async function cutout(key, width) {
  let file, pts, tint, saturation, src;
  if (STOCK[key]) {
    src = path.join(__dirname, "..", "assets", "stock", `${STOCK[key].stock}.jpg`);
    const m = await sharp(src).metadata();
    pts = scale(STOCK[key].pts, m.width / STOCK[key].view);
  } else {
    ({ file, pts, tint, saturation } = SHAPES[key]);
    src = path.join(SRC, `${file}.jpg`);
  }
  const meta = await sharp(src).metadata();
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const left = Math.max(0, Math.min(...xs));
  const top = Math.max(0, Math.min(...ys));
  const box = { left, top, width: Math.min(meta.width, Math.max(...xs)) - left, height: Math.min(meta.height, Math.max(...ys)) - top };
  const outline = STOCK[key] ? `<path d="${smooth(pts)}" fill="#fff"/>` : `<polygon points="${pts.map((p) => p.join(",")).join(" ")}" fill="#fff"/>`;
  const mask = await sharp(svg(meta.width, meta.height, outline)).blur(1.1).png().toBuffer();
  let base = sharp(src);
  if (tint) base = base.linear(tint.a, tint.b || [0, 0, 0]);
  const full = await base.ensureAlpha().composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
  let cut = await sharp(full).extract(box).png().toBuffer();
  if (saturation) cut = await sharp(cut).modulate({ saturation }).png().toBuffer();
  const sized = await sharp(cut).resize({ width, kernel: "lanczos3" }).sharpen({ sigma: 0.5 }).png().toBuffer();
  const m = await sharp(sized).metadata();
  return { input: sized, width: m.width, height: m.height };
}

/** darken a cut-out towards its base so it sits in the scene instead of floating */
async function grounded(item, strength = 0.32) {
  const { width, height } = item;
  const shade = await png(width, height, `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset=".52" stop-color="#2a1a06" stop-opacity="0"/><stop offset="1" stop-color="#2a1a06" stop-opacity="${strength}"/></linearGradient></defs><rect width="${width}" height="${height}" fill="url(#g)"/>`);
  return { ...item, input: await sharp(item.input).composite([{ input: shade, blend: "atop" }]).png().toBuffer() };
}

/** an elliptical contact shadow */
async function contact(cx, cy, rx, ry, W, H, opacity = 0.6) {
  return { input: await sharp(svg(W, H, `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#000" opacity="${opacity}"/>`)).blur(9).png().toBuffer() };
}

/* ---------- drawn ornaments ---------- */
const GOLD = `<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8f6420"/><stop offset=".3" stop-color="#e8c675"/><stop offset=".5" stop-color="#fff0bd"/><stop offset=".72" stop-color="#c99a45"/><stop offset="1" stop-color="#8f6420"/></linearGradient>`;

/** pointed (ogee) arch with its springing line at `spring` */
const archPath = (x, y, w, h, spring = 0.42) => {
  const s = y + h * spring;
  const cx = x + w / 2;
  return `M${x},${y + h} V${s} C${x},${y + h * spring * 0.5} ${x + w * 0.2},${y + h * 0.13} ${cx - w * 0.09},${y + h * 0.055} Q${cx - w * 0.025},${y + h * 0.035} ${cx},${y} Q${cx + w * 0.025},${y + h * 0.035} ${cx + w * 0.09},${y + h * 0.055} C${x + w * 0.8},${y + h * 0.13} ${x + w},${y + h * spring * 0.5} ${x + w},${s} V${y + h} Z`;
};

/** a veined stone block seen slightly from above */
const stone = (x, y, w, h, id) => `
  <defs><linearGradient id="${id}f" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7d6440"/><stop offset=".35" stop-color="#cdb487"/><stop offset=".75" stop-color="#a98d5f"/><stop offset="1" stop-color="#5f4a2c"/></linearGradient>
  <linearGradient id="${id}t" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cbb68c"/><stop offset=".5" stop-color="#f0dfb8"/><stop offset="1" stop-color="#b79c6e"/></linearGradient></defs>
  <path d="M${x},${y} L${x + w},${y} L${x + w - 6},${y + h} L${x + 6},${y + h} Z" fill="url(#${id}f)"/>
  <path d="M${x},${y} L${x + 18},${y - 22} L${x + w - 18},${y - 22} L${x + w},${y} Z" fill="url(#${id}t)"/>
  <path d="M${x + w * 0.12},${y + h * 0.2} q${w * 0.2},${h * 0.3} ${w * 0.34},${h * 0.18} t${w * 0.4},${h * 0.35}" stroke="#6d5534" stroke-width="2.2" fill="none" opacity=".5"/>
  <path d="M${x + w * 0.55},${y + h * 0.08} q${w * 0.1},${h * 0.4} ${w * 0.32},${h * 0.5}" stroke="#f3e4bf" stroke-width="1.6" fill="none" opacity=".55"/>
  <rect x="${x}" y="${y}" width="${w}" height="3" fill="#fff2d0" opacity=".85"/>`;

const lantern = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">
  <circle cx="0" cy="150" r="125" fill="url(#halo)"/>
  <path d="M0,0 V26" stroke="url(#gold)" stroke-width="4"/><circle cx="0" cy="30" r="9" fill="none" stroke="url(#gold)" stroke-width="5"/>
  <path d="M-42,96 C-42,62 -14,60 0,40 C14,60 42,62 42,96 Z" fill="url(#gold)"/>
  <path d="M-50,96 H50 L44,110 H-44 Z" fill="url(#gold)"/>
  <path d="M-42,110 L-52,206 H52 L42,110 Z" fill="url(#flame)" stroke="url(#gold)" stroke-width="6"/>
  <path d="M-14,110 L-18,206 M14,110 L18,206 M-47,158 H47" stroke="url(#gold)" stroke-width="4"/>
  <path d="M-20,206 C-20,176 20,176 20,206 M-20,110 C-20,140 20,140 20,110" stroke="url(#gold)" stroke-width="3" fill="none"/>
  <path d="M-58,206 H58 L44,224 H-44 Z M-26,224 L-36,244 H36 L26,224 Z" fill="url(#gold)"/></g>`;

const mosqueShapes = (fill, accent) => {
  const dome = (cx, base, r) => `M${cx - r},${base} C${cx - r * 1.14},${base - r * 0.76} ${cx - r * 0.34},${base - r * 0.94} ${cx},${base - r * 1.56} C${cx + r * 0.34},${base - r * 0.94} ${cx + r * 1.14},${base - r * 0.76} ${cx + r},${base}Z`;
  const minaret = (x, top, base, w) => `<rect x="${x - w / 2}" y="${top + 26}" width="${w}" height="${base - top - 26}"/><rect x="${x - w}" y="${top + 74}" width="${w * 2}" height="6"/><rect x="${x - w}" y="${top + 142}" width="${w * 2}" height="6"/><path d="${dome(x, top + 28, w * 0.72)}"/><rect x="${x - 1}" y="${top - 6}" width="2" height="18"/>`;
  return `<g fill="${fill}">${minaret(40, 70, 330, 13)}${minaret(360, 70, 330, 13)}${minaret(92, 130, 330, 10)}${minaret(308, 130, 330, 10)}
    <rect x="70" y="262" width="260" height="68"/><rect x="132" y="218" width="136" height="48"/>
    <path d="${dome(200, 222, 62)}"/><path d="${dome(110, 266, 34)}"/><path d="${dome(290, 266, 34)}"/></g>
    <g fill="${accent}">${Array.from({ length: 11 }, (_, i) => `<path d="M${82 + i * 22},330 v-30 a6,9 0 0 1 12,0 v30z"/>`).join("")}<path d="M186,262 v-24 a14,20 0 0 1 28,0 v24z"/></g>`;
};

function random(seed) {
  return () => (seed = (seed * 16807) % 2147483647) / 2147483647;
}

const foliage = (cx, cy, n, spread, rnd) =>
  Array.from({ length: n }, () => {
    const x = cx + (rnd() - 0.5) * spread;
    const y = cy + (rnd() - 0.5) * spread * 1.3;
    const r = rnd() * 360;
    const k = 0.6 + rnd() * 1.1;
    return `<path d="M0,0 C12,-15 36,-14 54,0 C36,14 12,15 0,0Z" fill="${["#1f4a22", "#2f6a2c", "#173a1b", "#4d7a2f"][Math.floor(rnd() * 4)]}" transform="translate(${x} ${y}) rotate(${r}) scale(${k})"/>`;
  }).join("");

/* ---------- 1. hero, in separate layers so the page can animate them ---------- */
const HERO = { W: 1500, H: 860 };
const HERO_DEFS = `<defs>${GOLD}
    <linearGradient id="wall" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#082b13"/><stop offset=".55" stop-color="#103c1e"/><stop offset="1" stop-color="#061f0e"/></linearGradient>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbe3ad"/><stop offset=".6" stop-color="#e9b66a"/><stop offset="1" stop-color="#9c6b2f"/></linearGradient>
    <radialGradient id="halo"><stop offset="0" stop-color="#ffd67d" stop-opacity=".62"/><stop offset="1" stop-color="#ffd67d" stop-opacity="0"/></radialGradient>
    <radialGradient id="flame" cx=".5" cy=".55" r=".6"><stop offset="0" stop-color="#fff6cf"/><stop offset=".55" stop-color="#ffbe45"/><stop offset="1" stop-color="#7a4310"/></radialGradient></defs>`;

/* each slide: [layer name, product, width, stand, bottom of product, depth] */
const BACK = { x: 625, y: 560, w: 450, h: 220 };
const LEFT = { x: 330, y: 668, w: 440, h: 128 };
const RIGHT = { x: 1010, y: 700, w: 440, h: 98 };
const SLIDES = {
  signature: [["back", "stockOlive", 440, BACK, 556, 0.45], ["left", "stockMaroon", 405, LEFT, 668, 1], ["right", "stockWhite", 400, RIGHT, 700, 0.8]],
  caps: [["back", "stockCream", 410, BACK, 556, 0.45], ["left", "stockBlue", 425, LEFT, 668, 1], ["right", "stockCopper", 420, RIGHT, 700, 0.8]],
  rumal: [["back", "rumal", 330, BACK, 556, 0.45], ["left", "stockWhite", 385, LEFT, 668, 1], ["right", "stockMaroon", 385, RIGHT, 700, 0.8]],
  wholesale: [["back", "stockBlue", 465, BACK, 556, 0.45], ["left", "stockCopper", 420, LEFT, 668, 1], ["right", "stockOlive", 355, RIGHT, 700, 0.8]],
};

async function buildHero() {
  const { W, H } = HERO;
  const rnd = random(11);
  const win = archPath(975, 58, 360, 660, 0.4);
  const back = `${HERO_DEFS}<rect width="${W}" height="${H}" fill="url(#wall)"/><ellipse cx="1080" cy="380" rx="600" ry="430" fill="url(#halo)" opacity=".75"/>
    <clipPath id="w"><path d="${win}"/></clipPath>
    <g clip-path="url(#w)"><rect x="970" y="54" width="372" height="668" fill="url(#sky)"/><g transform="translate(968 150) scale(0.94)" opacity=".86">${mosqueShapes("#a87a45", "#f8dca0")}</g><rect x="970" y="560" width="372" height="160" fill="#8a6a3c" opacity=".55"/></g>
    <path d="${win}" fill="none" stroke="url(#gold)" stroke-width="9"/><path d="${archPath(955, 34, 400, 710, 0.4)}" fill="none" stroke="url(#gold)" stroke-width="3" opacity=".75"/>
    <rect y="772" width="${W}" height="88" fill="#041b0c"/><rect y="772" width="${W}" height="3" fill="#b68a3e" opacity=".6"/>`;
  const bokeh = Array.from({ length: 45 }, () => `<circle cx="${820 + rnd() * 680}" cy="${120 + rnd() * 560}" r="${2 + rnd() * 7}" fill="#ffdd91" opacity="${0.1 + rnd() * 0.3}"/>`).join("");
  await sharp(await png(W, H, back))
    .composite([{ input: await sharp(svg(W, H, bokeh)).blur(3).png().toBuffer() }])
    .webp({ quality: 90 })
    .toFile(out("hero", "layers", "background.webp"));

  const art = { slides: {} };
  const pct = ({ left, top, width, height }) => ({ left: +((left / W) * 100).toFixed(3), top: +((top / H) * 100).toFixed(3), width: +((width / W) * 100).toFixed(3), height: +((height / H) * 100).toFixed(3) });
  const save = (file, canvas, box) => sharp(canvas).extract(box).webp({ quality: 90, alphaQuality: 96 }).toFile(out("hero", "layers", file));
  const blank = (layers) => sharp({ create: { width: W, height: H, channels: 4, background: "#0000" } }).composite(layers).png().toBuffer();

  const leaves = { left: 1340, top: 0, width: 160, height: 330 };
  await save("leaves.webp", await png(W, H, foliage(1495, 110, 64, 185, rnd)), leaves);
  const lamp = { left: 1270, top: 150, width: 230, height: 340 };
  await save("lantern.webp", await png(W, H, HERO_DEFS + lantern(1385, 175, 1.15)), lamp);
  art.leaves = pct(leaves);
  art.lantern = pct(lamp);

  // product layers carry a content fingerprint in their name, so image caches never serve old artwork
  const layerDir = path.join(PUB, "hero", "layers");
  for (const old of fs.readdirSync(layerDir)) if (new RegExp(`^(${Object.keys(SLIDES).join("|")})-(back|left|right)(-[0-9a-f]{8})?\.webp$`).test(old)) fs.unlinkSync(path.join(layerDir, old));

  for (const [slide, parts] of Object.entries(SLIDES)) {
    art.slides[slide] = [];
    for (const [name, key, width, stand, bottom, depth] of parts) {
      let item = await cutout(key, width);
      const maxHeight = bottom - 70;
      if (item.height > maxHeight) {
        const buf = await sharp(item.input).resize({ height: maxHeight }).png().toBuffer();
        const m = await sharp(buf).metadata();
        item = { input: buf, width: m.width, height: m.height };
      }
      item = await grounded(item, 0.26);
      const cx = stand.x + stand.w / 2;
      const left = Math.round(cx - item.width / 2);
      const top = bottom - item.height;
      const canvas = await blank([
        { input: await png(W, H, HERO_DEFS + stone(stand.x, stand.y + 4, stand.w, stand.h, name)) },
        await contact(cx, bottom - 3, Math.round(item.width * 0.45), 20, W, H),
        { input: item.input, left, top },
      ]);
      const x0 = Math.max(0, Math.min(stand.x, left) - 30);
      const y0 = Math.max(0, Math.min(top, stand.y - 22) - 16);
      const box = { left: x0, top: y0, width: Math.min(W, Math.max(stand.x + stand.w, left + item.width) + 30) - x0, height: Math.min(H, stand.y + stand.h + 14) - y0 };
      const layer = await sharp(canvas).extract(box).webp({ quality: 90, alphaQuality: 96 }).toBuffer();
      const fileName = `${slide}-${name}-${crypto.createHash("sha1").update(layer).digest("hex").slice(0, 8)}.webp`;
      fs.writeFileSync(out("hero", "layers", fileName), layer);
      art.slides[slide].push({ name, src: `/hero/layers/${fileName}`, depth, ...pct(box) });
    }
  }
  const data = path.join(__dirname, "..", "src", "content");
  fs.mkdirSync(data, { recursive: true });
  fs.writeFileSync(path.join(data, "hero-art.json"), JSON.stringify(art, null, 2) + "\n");
}

/* ---------- 2. category arches ---------- */
async function buildArches() {
  const W = 480;
  const H = 580;
  const defs = `<defs>${GOLD}<radialGradient id="bg" cx=".5" cy=".62" r=".7"><stop offset="0" stop-color="#2c6a3b"/><stop offset=".55" stop-color="#103c1e"/><stop offset="1" stop-color="#041b0c"/></radialGradient>
    <radialGradient id="halo"><stop offset="0" stop-color="#ffd67d" stop-opacity=".5"/><stop offset="1" stop-color="#ffd67d" stop-opacity="0"/></radialGradient></defs>`;
  const outer = archPath(5, 5, W - 10, H - 10);
  const inner = archPath(26, 40, W - 52, H - 58);
  const items = { caps: ["embroidered", 350], turbans: ["turbans", 285], scarves: ["rumal", 290], tasbih: ["tasbih", 190], others: ["covers", 340] };
  const mask = await png(W, H, `<path d="${outer}" fill="#fff"/>`);
  for (const [name, [key, width]] of Object.entries(items)) {
    let item = await cutout(key, width);
    if (item.height > 400) {
      const buf = await sharp(item.input).resize({ height: 400 }).png().toBuffer();
      const m = await sharp(buf).metadata();
      item = { input: buf, width: m.width, height: m.height };
    }
    const floor = 512;
    const tile = await sharp(await png(W, H, `${defs}<path d="${outer}" fill="url(#bg)"/><ellipse cx="240" cy="360" rx="190" ry="210" fill="url(#halo)"/><ellipse cx="240" cy="${floor + 8}" rx="205" ry="34" fill="#c3a46d"/><ellipse cx="240" cy="${floor}" rx="190" ry="27" fill="#e7d3a6"/>`))
      .composite([
        await contact(240, floor - 2, Math.round(item.width * 0.42), 15, W, H, 0.55),
        { input: (await grounded(item, 0.22)).input, left: Math.round((W - item.width) / 2), top: floor - item.height + 4 },
        { input: await png(W, H, `${defs}<path d="${outer}" fill="none" stroke="url(#gold)" stroke-width="7"/><path d="${inner}" fill="none" stroke="url(#gold)" stroke-width="2.5" opacity=".85"/>`) },
      ])
      .png()
      .toBuffer();
    // keep the outline's outer half; everything beyond it stays transparent
    const edge = await sharp(await png(W, H, `<path d="${outer}" fill="#fff" stroke="#fff" stroke-width="8"/>`)).png().toBuffer();
    await sharp(tile).composite([{ input: edge || mask, blend: "dest-in" }]).webp({ quality: 90, alphaQuality: 96 }).toFile(out("categories", "arch", `${name}.webp`));
  }
}

/* ---------- 3. banner products (transparent) ---------- */
async function buildBanners() {
  const group = async (name, W, H, parts) => {
    const layers = [];
    for (const [key, width, cx, bottom] of parts) {
      const item = await grounded(await cutout(key, width), 0.25);
      layers.push(await contact(cx, bottom - 4, Math.round(width * 0.46), 14, W, H, 0.55));
      layers.push({ input: item.input, left: Math.round(cx - item.width / 2), top: bottom - item.height });
    }
    await sharp({ create: { width: W, height: H, channels: 4, background: "#0000" } }).composite(layers).webp({ quality: 90, alphaQuality: 96 }).toFile(out("banners", `${name}.webp`));
  };
  await group("wholesale-caps", 640, 430, [["embroidered", 320, 330, 285], ["acStack", 300, 168, 405], ["padma", 245, 485, 405]]);
  await group("retail-cap", 560, 430, [["embroidered", 480, 280, 405]]);
}

/* ---------- 4. about: mosque in a golden arch (illustration only) ---------- */
async function buildAbout() {
  const W = 880;
  const H = 580;
  const rnd = random(29);
  const defs = `<defs>${GOLD}<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fa9c4"/><stop offset=".55" stop-color="#f3d9a4"/><stop offset="1" stop-color="#c08d48"/></linearGradient>
    <linearGradient id="wall" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#103c1e"/><stop offset="1" stop-color="#041b0c"/></linearGradient>
    <radialGradient id="sun"><stop offset="0" stop-color="#fff5cf" stop-opacity=".95"/><stop offset="1" stop-color="#fff5cf" stop-opacity="0"/></radialGradient></defs>`;
  const win = archPath(70, 36, 740, 544, 0.52);
  const body = `${defs}<rect width="${W}" height="${H}" fill="url(#wall)"/><clipPath id="w"><path d="${win}"/></clipPath>
    <g clip-path="url(#w)"><rect width="${W}" height="${H}" fill="url(#sky)"/><circle cx="300" cy="330" r="270" fill="url(#sun)"/>
    <g transform="translate(110 -4) scale(1.65)">${mosqueShapes("#f6ead0", "#a9793a")}</g>
    <g transform="translate(110 -4) scale(1.65)" fill="#c99a45"><path d="M138,222 C129,175 179,164 200,125 C221,164 271,175 262,222Z"/></g>
    <rect y="494" width="${W}" height="90" fill="#8f7448"/><rect y="520" width="${W}" height="64" fill="#2f5b46"/><path d="M360,520 L520,520 L640,580 L240,580Z" fill="#7ea9a0" opacity=".75"/>
    ${foliage(95, 520, 90, 150, rnd)}${foliage(790, 520, 90, 150, rnd)}</g>
    <path d="${win}" fill="none" stroke="url(#gold)" stroke-width="11"/><path d="${archPath(48, 14, 784, 580, 0.52)}" fill="none" stroke="url(#gold)" stroke-width="3" opacity=".8"/>`;
  await sharp(await png(W, H, body)).webp({ quality: 90 }).toFile(out("about", "mosque-arch.webp"));
}

(async () => {
  await buildHero();
  await buildArches();
  await buildBanners();
  await buildAbout();
  console.log("Homepage artwork built.");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
