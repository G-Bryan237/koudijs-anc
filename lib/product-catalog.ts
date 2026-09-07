import type { Product } from "./data";
const images: Record<string, string> = {
  tilapia: "tilapia",
  "poisson-chat": "catfish",
  "poulets-de-chair": "broiler",
  pondeuses: "layer",
  porcelets: "piglet",
  truies: "sow",
  "porcs-en-croissance": "piglet",
};
export function productImage(id: string) {
  const family = Object.keys(images)
    .sort((a, b) => b.length - a.length)
    .find((key) => id === key || id.startsWith(key + "-"));
  return "/images/products/" + (images[family || ""] || "piglet") + ".webp";
}
const fishStages = [
  {
    id: "demarrage",
    fr: "Démarrage",
    en: "Starter",
    sizes: ["1–2 mm", "1–2 mm"],
    purposeFr: "Pour les alevins et le début de croissance.",
    purposeEn: "For fry and early growth.",
  },
  {
    id: "croissance",
    fr: "Croissance",
    en: "Grower",
    sizes: ["4–6 mm", "3–6 mm"],
    purposeFr: "Pour la phase de croissance intermédiaire.",
    purposeEn: "For the intermediate growth stage.",
  },
  {
    id: "finition",
    fr: "Finition",
    en: "Finisher",
    sizes: ["6–8 mm", "6–8 mm"],
    purposeFr: "Pour la phase de finition et de pré-grossissement.",
    purposeEn: "For the finishing and pre-grow-out stage.",
  },
];
export const expandedProducts: Product[] = [
  ...(["tilapia", "poisson-chat"] as const).flatMap((family, index) =>
    fishStages.map((stage) => ({
      id: family + "-" + stage.id,
      category: "aquaculture" as const,
      family,
      image: productImage(family),
      pelletSize: stage.sizes[index],
      name: {
        fr: (index ? "Poisson-chat" : "Tilapia") + " · " + stage.fr,
        en: (index ? "Catfish" : "Tilapia") + " · " + stage.en,
      },
      description: {
        fr:
          "Aliment KOUDIJS " +
          (index ? "pour poisson-chat" : "pour tilapia") +
          ". " +
          stage.purposeFr +
          " Granulométrie indiquée sur le flyer : " +
          stage.sizes[index] +
          ". Faites confirmer la référence disponible.",
        en:
          "KOUDIJS " +
          (index ? "catfish" : "tilapia") +
          " feed. " +
          stage.purposeEn +
          " Flyer pellet size: " +
          stage.sizes[index] +
          ". Confirm the available product reference with our team.",
      },
      stages: { fr: stage.fr, en: stage.en },
      available: true,
    })),
  ),
  ...[
    {
      id: "gestation",
      fr: "Gestation",
      en: "Gestation",
      purposeFr: "pour les truies gestantes",
      purposeEn: "for gestating sows",
    },
    {
      id: "lactation",
      fr: "Lactation",
      en: "Lactation",
      purposeFr: "pour les truies allaitantes",
      purposeEn: "for lactating sows",
    },
  ].map((stage) => ({
    id: "truies-" + stage.id,
    category: "porcs" as const,
    family: "truies",
    image: productImage("truies"),
    name: { fr: "Aliment truies · " + stage.fr, en: "Sow feed · " + stage.en },
    description: {
      fr:
        "Alimentation KOUDIJS " +
        stage.purposeFr +
        ". Précisez la phase de reproduction et l’effectif pour demander une recommandation et un devis.",
      en:
        "KOUDIJS nutrition " +
        stage.purposeEn +
        ". Include the reproductive stage and number of animals for a recommendation and quotation.",
    },
    stages: { fr: stage.fr, en: stage.en },
    available: true,
  })),
];
