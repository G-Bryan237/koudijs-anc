const images: Record<string, string> = {
  tilapia: "tilapia",
  "poisson-chat": "catfish",
  "poulets-de-chair": "broiler",
  pondeuses: "layers",
  porcelets: "piglet",
  truies: "sow",
  "porcs-en-croissance": "piglet",
};
export function productImage(id: string) {
  const family = Object.keys(images)
    .sort((a, b) => b.length - a.length)
    .find((key) => id === key || id.startsWith(key + "-"));
  return "/images/products/" + (images[family || ""] || "piglet") + ".png";
}
