// Makes the brand icons the site serves: each master in assets/icons/*.png becomes ready-sized WebP files in
// public/icons (96, 192 and 400px wide), served as they are, so no icon waits on the image resizer.
//
//   npm run make:icons      (after adding or changing a master; commit the results)
/* eslint-disable no-console -- a command-line tool: its report is the output */
import { readdirSync } from "node:fs";
import sharp from "sharp";

const WIDTHS = [96, 192, 400];
for (const file of readdirSync("assets/icons").filter((f) => f.endsWith(".png"))) {
  const name = file.replace(/\.png$/, "");
  const { width } = await sharp(`assets/icons/${file}`).metadata();
  for (const w of WIDTHS.filter((x) => x <= width)) {
    const out = `public/icons/${name}-${w}.webp`;
    // Flat artwork: lossless is often the smaller of the two at larger sizes; keep whichever is.
    const img = sharp(`assets/icons/${file}`).resize({ width: w });
    const [lossy, lossless] = await Promise.all([
      img.clone().webp({ quality: 90, alphaQuality: 90, effort: 6 }).toBuffer(),
      img.clone().webp({ lossless: true, effort: 6 }).toBuffer(),
    ]);
    const best = lossless.length < lossy.length ? lossless : lossy;
    await sharp(best).toFile(out);
    console.log(`${out} ${(best.length / 1024).toFixed(1)} KB`);
  }
}
