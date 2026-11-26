// Builds the 1200x630 link-preview images in public/og/ (one per page), a 1200x1200 version of each in public/og/square/
// (Google's search thumbnail is a square crop, so these keep the logo and headline in the middle; lib/PageImageJsonLd.tsx),
// and the square site icons app/icon.png and app/apple-icon.png (Google only shows a square favicon).
// Run: node scripts/make-og.mjs   (renders in Chromium with the site's own fonts; uses the installed Google Chrome)
import sharp from "sharp";
import { chromium } from "@playwright/test";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { EVENTS } from "../lib/content/events.ts";

const GOLD = "#e6cf9e";
const url = (f) => pathToFileURL(resolve(f)).href;
// Wording and photos follow each page's own hero. Lines starting with ~ are italic gold. `logo`: resorts | mare | (Tavaro).
const R = "public/images/resorts/", T = "public/images/things-to-do/", H = "public/images/heroes/";
const PAGES = [
  { file: "home", photo: "public/photos/home-hero-poster.jpg", kicker: "TAVARO GROUP", lines: ["Discover the world", "~between worlds"] },
  { file: "about", photo: "public/photos/drone-hero.jpg", pos: "50% 90%", kicker: "ABOUT TAVARO", lines: ["Places for people to", "~stay, live, gather and grow"] },
  { file: "contact", photo: "public/photos/residences-villa.jpg", kicker: "KOKAPET, HYDERABAD", lines: ["Let's plan your", "~next Tavaro moment"] },
  { file: "resorts", photo: H + "resorts-hero.jpg", kicker: "KOKAPET, HYDERABAD", lines: ["A world away,", "~yet close to you"], logo: "resorts" },
  { file: "resorts-venues", photo: R + "venues/tavaro-lawn.jpg", kicker: "VENUES & CELEBRATIONS", lines: ["Weddings and celebrations", "~at Tavaro"], logo: "resorts" },
  { file: "resorts-accommodations", photo: R + "suite.jpg", kicker: "TAVARO RESORTS · KOKAPET", lines: ["Book your stay", "~at Tavaro Resorts"], logo: "resorts" },
  { file: "resorts-location", photo: R + "venues/sanctuary-lawn.jpg", kicker: "YOU'VE ARRIVED", lines: ["Tavaro Resorts", "~Kokapet, Hyderabad"], logo: "resorts" },
  { file: "resorts-photos", photo: R + "poolside.jpg", kicker: "TAVARO RESORTS", lines: ["Photos & Videos", "~from the resort"], logo: "resorts" },
  { file: "resorts-things-to-do-create", photo: T + "create-hero.jpg", kicker: "CREATE YOUR EXPERIENCE", lines: ["Something special,", "~made yours."], logo: "resorts" },
  { file: "resorts-things-to-do-explore", photo: T + "explore-hero.jpg", kicker: "EXPLORE AT YOUR OWN PACE", lines: ["A little more room", "~to be."], logo: "resorts" },
  { file: "residences", photo: H + "residences-hero.jpg", pos: "75% 50%", kicker: "TAVARO RESIDENCES", lines: ["Come home", "~to yourself"] },
  { file: "residences-leela", photo: H + "leela-hero.jpg", kicker: "TAVARO RESIDENCES", lines: ["Leela", "~apartments wrapped in green"] },
  { file: "residences-leela-location", photo: H + "leela-hero.jpg", kicker: "WELCOME HOME", lines: ["Leela", "~off Radial Road 7, Hyderabad"] },
  { file: "residences-bhairavi-nilayam", photo: H + "bhairavi-nilayam-hero.jpg", kicker: "A PRIVATE RESIDENCE", lines: ["Bhairavi Nilayam", "~shaped by light"] },
  { file: "experiences", photo: H + "experiences-hero.jpg", kicker: "TAVARO EXPERIENCES", lines: ["Moments made", "~extraordinary"] },
  { file: "wellness", photo: H + "wellness-hero.jpg", kicker: "WELLNESS AT TAVARO", lines: ["A Tavaro", "~way of life"] },
  { file: "mare", photo: H + "mare-hero-cup-right.jpg", kicker: "MÀRE COFFEE HOUSE", lines: ["Where life", "~comes together"], logo: "mare" },
  // One per experience page (/experiences/<id>; its /book page uses it too), from lib/content/events.ts.
  ...EVENTS.map((e) => ({ file: `experiences-${e.id}`, photo: `public${e.src}`, kicker: "TAVARO EXPERIENCES", lines: [e.title, "~at Tavaro"] })),
];

const gold = (f, h) => readFileSync(f, "utf8").replace("<svg ", `<svg fill="#c9a45a" height="${h}" `);
const LOGOS = {
  tavaro: gold("public/brand/tavaro-logo.svg", 92),
  resorts: gold("public/brand/tavaro-logo-resorts.svg", 110),
  mare: `<img src="${url("public/icons/mare-wordmark-white-400.webp")}" height=84>`,
};
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

const html = ({ photo, pos = "center", kicker, lines, logo = "tavaro" }, square) => `<style>
@font-face{font-family:H;src:url(${url("app/fonts/HypatiaSansPro-SemiBold.woff2")})}
@font-face{font-family:A;src:url(${url("app/fonts/ArchivoExpanded-SemiBold.woff2")})}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;position:relative;overflow:hidden;background:#0b0906 url(${url(photo)}) ${pos}/cover;color:#fff}
.g{position:absolute;inset:0;background:linear-gradient(100deg,rgba(11,9,6,.9),rgba(11,9,6,.62) 50%,rgba(11,9,6,.15))}
.logo{position:absolute;right:80px;top:56px;filter:drop-shadow(0 1px 8px rgba(0,0,0,.9)) drop-shadow(0 0 2px rgba(0,0,0,.8))}
.s{position:absolute;inset:0 0 auto;height:260px;background:linear-gradient(rgba(11,9,6,.7),transparent)}
.t{position:absolute;left:80px;top:50%;transform:translateY(-50%)}
.k{font:20px A;letter-spacing:6px;color:${GOLD};margin-bottom:28px}
h1{font:78px/88px H;font-weight:600}
h1.long{font-size:66px;line-height:76px}
h1 i{color:${GOLD}}
.f{position:absolute;left:80px;bottom:56px;display:flex;align-items:center;gap:18px;font:18px A;letter-spacing:4px;opacity:.85}
.f b{width:48px;height:2px;background:${GOLD}}
</style><body><div class=g></div><div class=s></div><div class=logo>${LOGOS[logo]}</div>
<div class=t><div class=k>${esc(kicker)}</div><h1 class="${lines.some((l) => l.length > 24) ? "long" : ""}">${lines.map((l) => (l[0] === "~" ? `<i>${esc(l.slice(1))}</i>` : esc(l))).join("<br>")}</h1></div>
<div class=f><b></b>TAVARO.IN</div>${square ? SQUARE_CSS : ""}`;

// Square: everything centred, logo large enough to read in a small search thumbnail.
const SQUARE_CSS = `<style>
body{width:1200px;height:1200px}
.g{background:radial-gradient(circle at 50% 55%,rgba(11,9,6,.55),rgba(11,9,6,.88))}
.s{display:none}
.logo{right:auto;left:50%;top:150px;transform:translateX(-50%) scale(2.6);transform-origin:top center}
.t{left:60px;right:60px;top:auto;bottom:220px;transform:none;text-align:center}
.k{font-size:28px;letter-spacing:8px;margin-bottom:32px}
h1,h1.long{font-size:92px;line-height:104px}
.f{left:50%;bottom:90px;transform:translateX(-50%);font-size:24px}
</style>`;

mkdirSync("public/og/square", { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const [square, dir, height] of [[false, "public/og", 630], [true, "public/og/square", 1200]]) {
  await page.setViewportSize({ width: 1200, height });
  for (const p of PAGES) {
    const tmp = `${tmpdir()}/og-${p.file}.html`;
    writeFileSync(tmp, html(p, square));
    await page.goto(`file://${tmp}`);
    await page.evaluate(() => document.fonts.ready);
    const png = await page.screenshot();
    await sharp(png).jpeg({ quality: 80, mozjpeg: true }).toFile(`${dir}/${p.file}.jpg`);
    console.log(dir, p.file);
  }
}

// Site icon: the gold horse, square (sizes are multiples of 48 for Google). Transparent for browser tabs and search;
// the iPhone home-screen icon keeps the brand's dark ground, since iOS fills transparency with black anyway.
const horse = readFileSync("public/brand/tavaro-symbol.svg", "utf8").replace("<svg ", '<svg fill="#c9a45a" ');
// The tab icon fills the square edge to edge so it matches other tabs; the home-screen one keeps a margin.
const icon = (size, background = "#0000", fill = 1) =>
  sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: Buffer.from(horse.replace("<svg ", `<svg width="${Math.round(size * fill)}" `)), gravity: "center" }])
    .png();
await icon(480).toFile("app/icon.png");
await icon(180, "#0b0906", 0.74).toFile("app/apple-icon.png");
await browser.close();
