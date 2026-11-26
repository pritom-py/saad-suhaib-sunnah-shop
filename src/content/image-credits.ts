/** Openly licensed photos used in the homepage carousel. Keep this list in step with assets/stock. */
export interface ImageCredit {
  title: string;
  author: string;
  license: string;
  licenseUrl: string;
  source: string;
}

const BY_SA = { license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" };
const commons = (file: string) => `https://commons.wikimedia.org/wiki/File:${file}`;

export const IMAGE_CREDITS: ImageCredit[] = [
  { title: "Muslim prayer cap", author: "Arman Hossain", license: "CC0 1.0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/", source: "https://wordpress.org/photos/photo/65062ed8ae/" },
  { title: "Taqiyah Rezowan", author: "Rezowan", ...BY_SA, source: commons("Taqiyah_Rezowan.jpg") },
  { title: "Men Muslim Arabic Caps 03", author: "Ssemmanda will", ...BY_SA, source: commons("Men_Muslim_Arabic_Caps_03.jpg") },
  { title: "Men Muslim Arabic Caps 05", author: "Ssemmanda will", ...BY_SA, source: commons("Men_Muslim_Arabic_Caps_05.jpg") },
  { title: "Men Muslim Arabic Caps 27", author: "Ssemmanda will", ...BY_SA, source: commons("Men_Muslim_Arabic_Caps_27.jpg") },
  { title: "Men Muslim Arabic Caps 28", author: "Ssemmanda will", ...BY_SA, source: commons("Men_Muslim_Arabic_Caps_28.jpg") },
];
