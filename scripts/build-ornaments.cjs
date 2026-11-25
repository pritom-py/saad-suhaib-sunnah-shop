/** Writes the reusable Islamic SVG ornaments into public/patterns and public/decorations. */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..", "public");
const put = (rel, w, h, body, extra = "") => {
  const f = path.join(root, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" ${extra}>${body}</svg>\n`);
};
const GOLD = "#C69532";
const grad = (id) => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8C5A0A"/><stop offset=".3" stop-color="#F6D77A"/><stop offset=".48" stop-color="#FFF2C2"/><stop offset=".68" stop-color="#E9BC52"/><stop offset="1" stop-color="#8C5A0A"/></linearGradient>`;

// eight-point star = two overlaid squares
const star8 = (cx, cy, r) => {
  const a = r * Math.SQRT1_2;
  return `<path d="M${cx - a},${cy - a}h${2 * a}v${2 * a}h${-2 * a}z M${cx},${cy - r}L${cx + r},${cy}L${cx},${cy + r}L${cx - r},${cy}z"/>`;
};

put("patterns/islamic-star-pattern.svg", 64, 64,
  `<g fill="none" stroke="${GOLD}" stroke-width=".9">${star8(32, 32, 18)}${star8(0, 0, 11)}${star8(64, 0, 11)}${star8(0, 64, 11)}${star8(64, 64, 11)}<circle cx="32" cy="32" r="7"/><path d="M32 0v14M32 50v14M0 32h14M50 32h14"/></g>`);

put("patterns/islamic-geometric.svg", 56, 96,
  `<g fill="none" stroke="${GOLD}" stroke-width=".8"><path d="M28 0L56 16V48L28 64L0 48V16Z"/><path d="M28 64V96M0 48L28 32L56 48M28 0V32M0 16L28 32L56 16"/><path d="M14 8L42 56M42 8L14 56M0 32H56"/></g>`);

put("patterns/gold-arabesque.svg", 120, 120,
  `<g fill="none" stroke="${GOLD}" stroke-width="1"><path d="M60 10C74 34 86 46 110 60C86 74 74 86 60 110C46 86 34 74 10 60C34 46 46 34 60 10Z"/><path d="M60 30C66 48 72 54 90 60C72 66 66 72 60 90C54 72 48 66 30 60C48 54 54 48 60 30Z"/><path d="M0 0C20 4 28 20 20 28C12 34 4 24 12 18M120 0C100 4 92 20 100 28C108 34 116 24 108 18M0 120C20 116 28 100 20 92C12 86 4 96 12 102M120 120C100 116 92 100 100 92C108 86 116 96 108 102"/></g>`);

// mosque skyline: single-colour so it can be tinted with a CSS mask
const dome = (cx, base, r) =>
  `M${cx - r},${base}C${cx - r * 1.14},${base - r * 0.78} ${cx - r * 0.34},${base - r * 0.94} ${cx},${base - r * 1.5}C${cx + r * 0.34},${base - r * 0.94} ${cx + r * 1.14},${base - r * 0.78} ${cx + r},${base}Z`;
const finial = (x, y) => `<path d="M${x - 1},${y}v-12h2v12z"/><circle cx="${x}" cy="${y - 14}" r="2.4"/>`;
const minaret = (x, top, w) =>
  `<path d="M${x - w / 2},180V${top + 18}h${w}V180z"/><path d="M${x - w},${top + 44}h${w * 2}v5h${-w * 2}zM${x - w},${top + 92}h${w * 2}v5h${-w * 2}z"/><path d="${dome(x, top + 20, w * 0.72)}"/>${finial(x, top + 20 - w * 1.05)}`;
const arches = (x0, n, y) =>
  Array.from({ length: n }, (_, i) => `M${x0 + i * 15},180V${y + 8}q0,-8 4.5,-11q4.5,3 4.5,11V180z`).join("");
put("decorations/mosque-silhouette.svg", 320, 180,
  `<path fill="#000" fill-rule="evenodd" d="M72 180V118H248V180Z${arches(86, 10, 142)}"/><g fill="#000"><path d="${dome(160, 120, 48)}"/>${finial(160, 49)}<path d="${dome(98, 120, 23)}"/><path d="${dome(222, 120, 23)}"/>${minaret(52, 40, 13)}${minaret(268, 18, 15)}${minaret(22, 92, 9)}${minaret(298, 84, 9)}<path d="M0 180v-22h320v22z"/></g>`);

put("decorations/section-ornament.svg", 40, 28,
  `<defs>${grad("g")}</defs><g fill="none" stroke="url(#g)" stroke-width="1.6"><path d="M20 2L32 14L20 26L8 14Z"/><path d="M20 7L27 14L20 21L13 14Z"/><path d="M8 14C4 10 1 12 2 14C1 16 4 18 8 14ZM32 14C36 10 39 12 38 14C39 16 36 18 32 14Z"/></g><circle cx="20" cy="14" r="2.4" fill="url(#g)"/>`);

put("decorations/golden-divider.svg", 240, 16,
  `<defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="240" y2="0"><stop offset="0" stop-color="#B47B19" stop-opacity="0"/><stop offset=".35" stop-color="#E9BC52"/><stop offset=".5" stop-color="#FFF2C2"/><stop offset=".65" stop-color="#E9BC52"/><stop offset="1" stop-color="#B47B19" stop-opacity="0"/></linearGradient></defs><path d="M0 8H104M136 8H240" stroke="url(#g)" stroke-width="1.4"/><path d="M120 1L127 8L120 15L113 8Z" fill="#780E15" stroke="#D4AF37"/><circle cx="108" cy="8" r="1.8" fill="#D4AF37"/><circle cx="132" cy="8" r="1.8" fill="#D4AF37"/>`);

put("decorations/golden-arch.svg", 619, 318,
  `<defs>${grad("g")}</defs><path d="M158 0C134 4 116 15 112 36C80 31 53 53 57 84C35 95 33 126 40 139C37 157 23 166 6 173C22 181 37 192 39 207C35 238 50 263 68 272C68 292 84 310 106 318" fill="none" stroke="url(#g)" stroke-width="7"/>`);

console.log("ornaments written");
