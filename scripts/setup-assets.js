import fs from 'fs';
import path from 'path';

const srcFolder = 'E:\\EHSARA';
const destProducts = path.resolve('public/products');
const destLogo = path.resolve('public/logo');
const destDocs = path.resolve('docs');

fs.mkdirSync(destProducts, { recursive: true });
fs.mkdirSync(destLogo, { recursive: true });
fs.mkdirSync(destDocs, { recursive: true });

// Copy logo
const uploadedLogo = 'C:/Users/hp/.gemini/antigravity/brain/ad0394a2-1d58-4cf1-9cee-a16a9e821f0a/.user_uploaded/media_1795598678859_67ee0ea1.jpg';
const fallbackLogo = path.join(srcFolder, 'LOGO.jpeg');

if (fs.existsSync(uploadedLogo)) {
  fs.copyFileSync(uploadedLogo, path.join(destLogo, 'logo.jpg'));
  fs.copyFileSync(uploadedLogo, path.join(destLogo, 'logo-round.jpg'));
} else if (fs.existsSync(fallbackLogo)) {
  fs.copyFileSync(fallbackLogo, path.join(destLogo, 'logo.jpg'));
}

// Copy reference mockup
const referenceImg = 'C:/Users/hp/.gemini/antigravity/brain/ad0394a2-1d58-4cf1-9cee-a16a9e821f0a/.user_uploaded/media_1795598678780_173909ab.jpg';
if (fs.existsSync(referenceImg)) {
  fs.copyFileSync(referenceImg, path.join(destDocs, 'approved-reference.jpg'));
  fs.copyFileSync(referenceImg, path.join('public', 'hero-reference.jpg'));
}

const fileMap = {
  'makra-tupi.jpg': 'WhatsApp Image 2026-11-24 at 11.34.05 PM.jpeg',
  'original-kalo-vip-haji-rumal.jpg': 'WhatsApp Image 2026-11-24 at 11.34.05 PM (1).jpeg',
  'fitting-bandha-pagri.jpg': 'WhatsApp Image 2026-11-24 at 11.34.05 PM (2).jpeg',
  'imatore-tupi.jpg': 'WhatsApp Image 2026-11-24 at 11.34.06 PM.jpeg',
  'khola-pagri.jpg': 'WhatsApp Image 2026-11-24 at 11.34.06 PM (1).jpeg',
  'double-embroidery-ac-tupi.jpg': 'WhatsApp Image 2026-11-24 at 11.34.06 PM (2).jpeg',
  'bangla-chicken-panch-kuli-tupi.jpg': 'WhatsApp Image 2026-11-24 at 11.34.07 PM.jpeg',
  'afghan-pagri.jpg': 'WhatsApp Image 2026-11-24 at 11.34.07 PM (1).jpeg',
  'padma-tupi.jpg': 'WhatsApp Image 2026-11-24 at 11.34.08 PM.jpeg',
  'digital-tasbih.jpg': 'WhatsApp Image 2026-11-24 at 11.34.08 PM (1).jpeg',
  'normal-ac-tupi.jpg': 'WhatsApp Image 2026-11-24 at 11.34.08 PM (2).jpeg',
  'noor-hosen-rumal.jpg': 'WhatsApp Image 2026-11-24 at 11.34.09 PM.jpeg',
  'qawmi-tupi-asol.jpg': 'WhatsApp Image 2026-11-24 at 11.34.09 PM (1).jpeg',
  'bangla-kashmiri-rumal.jpg': 'WhatsApp Image 2026-11-24 at 11.34.09 PM (2).jpeg',
  '2-number-insaf-tupi.jpg': 'WhatsApp Image 2026-11-24 at 11.34.10 PM.jpeg',
  'quraner-gilaf.jpg': 'WhatsApp Image 2026-11-24 at 11.34.10 PM (1).jpeg',
  'china-rumal.jpg': 'WhatsApp Image 2026-11-24 at 11.34.10 PM (2).jpeg',
  'javed-jafar-rumal.jpg': 'WhatsApp Image 2026-11-24 at 11.34.11 PM.jpeg',
  'qawmi-uchu-tupi.jpg': 'WhatsApp Image 2026-11-24 at 11.34.11 PM (1).jpeg',
  'chikon-sutar-jali-tupi.jpg': 'WhatsApp Image 2026-11-24 at 11.34.12 PM.jpeg',
  'machine-tupi.jpg': 'WhatsApp Image 2026-11-24 at 11.34.12 PM (1).jpeg',
  'double-embroidery-ac-tupi-alt.jpg': 'WhatsApp Image 2026-11-24 at 11.34.12 PM (2).jpeg',
  'japani-tore-tupi.jpg': 'WhatsApp Image 2026-11-24 at 11.34.13 PM.jpeg',
  '33-danar-tasbih.jpg': 'WhatsApp Image 2026-11-24 at 11.34.13 PM (1).jpeg',
  'packet-miswak.jpg': 'WhatsApp Image 2026-11-24 at 11.34.14 PM.jpeg',
  'biscuit-tupi.jpg': 'WhatsApp Image 2026-11-24 at 11.34.14 PM (1).jpeg',
  'kalo-haji-rumal.jpg': 'WhatsApp Image 2026-11-24 at 11.34.14 PM (2).jpeg',
  'guti-tupi.jpg': 'WhatsApp Image 2026-11-24 at 11.34.15 PM.jpeg',
  'packet-olive-miswak.jpg': 'WhatsApp Image 2026-11-24 at 11.34.15 PM (1).jpeg',
  'patla-bashundhara-tupi.jpg': 'WhatsApp Image 2026-11-24 at 11.34.15 PM (2).jpeg',
  'palestinian-rumal.jpg': 'WhatsApp Image 2026-11-24 at 11.34.16 PM.jpeg'
};

for (const [destName, srcName] of Object.entries(fileMap)) {
  const fullSrc = path.join(srcFolder, srcName);
  if (fs.existsSync(fullSrc)) {
    fs.copyFileSync(fullSrc, path.join(destProducts, destName));
  } else {
    console.warn(`File not found: ${fullSrc}`);
  }
}

console.log('All assets processed and copied successfully!');
