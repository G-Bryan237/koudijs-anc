import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
const directory = process.argv[2] || "C:/Users/Bryan/Downloads";
const fish = path.join(
  directory,
  "WhatsApp Image 2026-09-07 at 17.32.32 (1).jpeg",
);
const livestock = path.join(
  directory,
  "WhatsApp Image 2026-09-07 at 17.32.32.jpeg",
);
// Deterministic extraction: original pixels, no invented labels or packaging.
const crops = [
  {
    name: "tilapia",
    file: fish,
    width: 853,
    height: 1280,
    polygon: [
      [286, 559],
      [388, 573],
      [380, 789],
      [289, 800],
      [277, 783],
      [283, 626],
    ],
  },
  {
    name: "catfish",
    file: fish,
    width: 853,
    height: 1280,
    polygon: [
      [677, 558],
      [777, 570],
      [771, 800],
      [686, 811],
      [673, 790],
      [678, 643],
    ],
  },
  {
    name: "broiler",
    file: livestock,
    width: 809,
    height: 1080,
    polygon: [
      [185, 349],
      [258, 352],
      [264, 439],
      [258, 449],
      [198, 450],
      [193, 430],
    ],
  },
  {
    name: "layer",
    file: livestock,
    width: 809,
    height: 1080,
    polygon: [
      [211, 627],
      [282, 627],
      [294, 702],
      [288, 712],
      [215, 713],
    ],
  },
  {
    name: "sow",
    file: livestock,
    width: 809,
    height: 1080,
    polygon: [
      [635, 312],
      [711, 322],
      [724, 447],
      [717, 459],
      [643, 457],
      [637, 441],
    ],
  },
  {
    name: "piglet",
    file: livestock,
    width: 809,
    height: 1080,
    polygon: [
      [696, 567],
      [784, 574],
      [779, 694],
      [773, 706],
      [705, 704],
      [700, 692],
    ],
  },
];
await mkdir("public/images/products", { recursive: true });
for (const crop of crops) {
  const info = await sharp(crop.file).metadata();
  const points = crop.polygon.map(([x, y]) => [
    Math.round((x * info.width) / crop.width),
    Math.round((y * info.height) / crop.height),
  ]);
  const left = Math.min(...points.map((p) => p[0])),
    top = Math.min(...points.map((p) => p[1]));
  const width = Math.max(...points.map((p) => p[0])) - left + 1,
    height = Math.max(...points.map((p) => p[1])) - top + 1;
  const mask = Buffer.from(
    '<svg width="' +
      width +
      '" height="' +
      height +
      '"><polygon points="' +
      points.map(([x, y]) => x - left + "," + (y - top)).join(" ") +
      '" fill="white"/></svg>',
  );
  await sharp(crop.file)
    .extract({ left, top, width, height })
    .ensureAlpha()
    .composite([{ input: mask, blend: "dest-in" }])
    .webp({ quality: 95 })
    .toFile("public/images/products/" + crop.name + ".webp");
  console.log(crop.name + ": " + width + " x " + height);
}
