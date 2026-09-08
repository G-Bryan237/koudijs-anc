export type Locale = "fr" | "en";
export type Bilingual = { fr: string; en: string };
export type Category = "aquaculture" | "volaille" | "porcs";
export type Product = {
  id: string;
  category: Category;
  name: Bilingual;
  description: Bilingual;
  stages: Bilingual;
  available: boolean;
  image?: string;
  family?: string;
  pelletSize?: string;
};
export const categories: {
  id: Category;
  name: Bilingual;
  animals: Bilingual;
  description: Bilingual;
  image: string;
}[] = [
  {
    id: "aquaculture",
    name: { fr: "Aquaculture", en: "Aquaculture" },
    animals: { fr: "Tilapia & poisson-chat", en: "Tilapia & catfish" },
    description: {
      fr: "Des aliments pour accompagner vos poissons, de l’alevin à la finition.",
      en: "Feed for your fish, from fry through to the finishing stage.",
    },
    image: "/images/aquaculture.webp",
  },
  {
    id: "volaille",
    name: { fr: "Volaille", en: "Poultry" },
    animals: {
      fr: "Poulets de chair & pondeuses",
      en: "Broilers & laying hens",
    },
    description: {
      fr: "Des concentrés adaptés à la croissance et à la production d’œufs.",
      en: "Concentrates suited to growth and egg production.",
    },
    image: "/images/poultry.webp",
  },
  {
    id: "porcs",
    name: { fr: "Élevage porcin", en: "Pig farming" },
    animals: { fr: "Porcelets, porcs & truies", en: "Piglets, growers & sows" },
    description: {
      fr: "Des solutions nutritionnelles pour chaque phase de votre élevage.",
      en: "Nutrition solutions for each stage of your pig operation.",
    },
    image: "/images/pigs.webp",
  },
];
export const initialProducts: Product[] = [
  {
    id: "tilapia",
    category: "aquaculture",
    name: { fr: "Aliment pour tilapia", en: "Tilapia feed" },
    description: {
      fr: "Aliments KOUDIJS pour les différentes phases de croissance du tilapia. Notre équipe vous aide à choisir le format adapté à vos poissons.",
      en: "KOUDIJS feed for the different growth stages of tilapia. Our team helps you choose the appropriate format for your fish.",
    },
    stages: {
      fr: "Démarrage · Croissance · Finition",
      en: "Starter · Grower · Finisher",
    },
    available: true,
  },
  {
    id: "poisson-chat",
    category: "aquaculture",
    name: { fr: "Aliment pour poisson-chat", en: "Catfish feed" },
    description: {
      fr: "Une gamme d’aliments KOUDIJS destinée au poisson-chat, du démarrage à la finition. Demandez les caractéristiques de la référence disponible.",
      en: "A KOUDIJS feed range for catfish, from starter to finisher. Ask for the specifications of the available product.",
    },
    stages: {
      fr: "Démarrage · Croissance · Finition",
      en: "Starter · Grower · Finisher",
    },
    available: true,
  },
  {
    id: "poulets-de-chair",
    category: "volaille",
    name: { fr: "Concentré pour poulets de chair", en: "Broiler concentrate" },
    description: {
      fr: "Concentrés KOUDIJS pour l’alimentation des poulets de chair. Le taux d’incorporation doit être confirmé sur la fiche technique du produit.",
      en: "KOUDIJS concentrates for broiler feeding. Confirm the inclusion rate against the product’s technical data sheet.",
    },
    stages: {
      fr: "Démarrage · Croissance · Finition",
      en: "Starter · Grower · Finisher",
    },
    available: true,
  },
  {
    id: "pondeuses",
    category: "volaille",
    name: { fr: "Concentré pour pondeuses", en: "Layer concentrate" },
    description: {
      fr: "Concentrés KOUDIJS pour les poules pondeuses. Précisez l’âge de votre lot et sa phase de production pour obtenir une recommandation.",
      en: "KOUDIJS concentrates for laying hens. Share your flock’s age and production stage for a product recommendation.",
    },
    stages: { fr: "Élevage · Ponte", en: "Rearing · Laying" },
    available: true,
  },
  {
    id: "porcelets",
    category: "porcs",
    name: { fr: "Aliment pour porcelets", en: "Piglet feed" },
    description: {
      fr: "Solutions KOUDIJS pour les porcelets en croissance. Le choix de l’aliment tient compte du sevrage, de l’âge et du poids de vos animaux.",
      en: "KOUDIJS nutrition for growing piglets. Feed selection takes weaning, age and animal weight into account.",
    },
    stages: {
      fr: "Pré-démarrage · Démarrage · Croissance · Finition",
      en: "Pre-starter · Starter · Grower · Finisher",
    },
    available: true,
  },
  {
    id: "truies",
    category: "porcs",
    name: { fr: "Aliment pour truies", en: "Sow feed" },
    description: {
      fr: "Alimentation KOUDIJS pour les truies gestantes et allaitantes. Demandez un programme adapté à la phase de reproduction.",
      en: "KOUDIJS nutrition for gestating and lactating sows. Request a programme suited to the reproductive stage.",
    },
    stages: { fr: "Gestation · Lactation", en: "Gestation · Lactation" },
    available: true,
  },
];
export type Enquiry = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  location: string;
  category: string;
  product: string;
  quantity: string;
  message: string;
  locale: Locale;
  status: "new" | "contacted" | "quoted" | "confirmed" | "delivered" | "closed";
};
export const statuses: Enquiry["status"][] = [
  "new",
  "contacted",
  "quoted",
  "confirmed",
  "delivered",
  "closed",
];
export const statusNames: Record<Enquiry["status"], Bilingual> = {
  new: { fr: "Nouvelle", en: "New" },
  contacted: { fr: "Contacté", en: "Contacted" },
  quoted: { fr: "Devis envoyé", en: "Quoted" },
  confirmed: { fr: "Confirmée", en: "Confirmed" },
  delivered: { fr: "Livrée", en: "Delivered" },
  closed: { fr: "Clôturée", en: "Closed" },
};
export function whatsapp(locale: Locale, subject?: string) {
  return `https://wa.me/237659199943?text=${encodeURIComponent(locale === "fr" ? `Bonjour, je souhaite ${subject || "des informations sur les aliments KOUDIJS pour mon élevage"}.` : `Hello, I would like ${subject || "information about KOUDIJS feed for my farm"}.`)}`;
}
