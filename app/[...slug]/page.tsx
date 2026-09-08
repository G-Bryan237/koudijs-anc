import { Cart } from "@/components/cart";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import {
  Catalog,
  ProductDetail,
  Contact,
  About,
  Delivery,
} from "@/components/website";
import { Resources, Legal, Credits } from "@/components/resources";
import { readStore } from "@/lib/store";
import { categories, type Category } from "@/lib/data";
export const dynamic = "force-dynamic";
type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ produit?: string }>;
};
const titles: Record<string, [string, string]> = {
  panier: ["Votre panier", "Your shopping cart"],
  produits: ["Nos produits KOUDIJS", "Our KOUDIJS products"],
  aquaculture: ["Nutrition aquaculture", "Aquaculture nutrition"],
  volaille: ["Nutrition volaille", "Poultry nutrition"],
  porcs: ["Nutrition porcine", "Pig nutrition"],
  "a-propos": ["Notre entreprise", "About us"],
  contact: ["Contact", "Contact"],
  devis: ["Demander un devis", "Request a quotation"],
  livraison: ["Livraison au Cameroun", "Delivery in Cameroon"],
  conseils: ["Conseils et ressources", "Advice and resources"],
  confidentialite: ["Politique de confidentialité", "Privacy policy"],
  conditions: ["Conditions générales", "Terms and conditions"],
  credits: ["Crédits photographiques", "Photography credits"],
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const en = (await cookies()).get("anc_locale")?.value === "en";
  const products = (await readStore()).products;
  const p =
    slug[0] === "produits" && slug[1]
      ? products.find((p) => p.id === slug[1])
      : undefined;
  return {
    title: p
      ? p.name[en ? "en" : "fr"]
      : titles[slug[0]]?.[en ? 1 : 0] || "Animal Nutrition Cameroon",
    description: p?.description[en ? "en" : "fr"],
  };
}
export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const { produit } = await searchParams;
  const products = (await readStore()).products.filter((p) => p.available);
  if (slug.length === 2 && slug[0] === "produits") {
    const p = products.find((p) => p.id === slug[1]);
    if (!p) notFound();
    return <ProductDetail product={p} products={products} />;
  }
  if (
    slug.length === 2 &&
    slug[0] === "conseils" &&
    [
      "preparer-sa-demande",
      "lire-une-fiche-produit",
      "recevoir-sa-livraison",
    ].includes(slug[1])
  )
    return <Resources slug={slug[1]} />;
  if (slug.length !== 1) notFound();
  if (categories.some((c) => c.id === slug[0]))
    return (
      <Catalog
        key={slug[0]}
        category={slug[0] as Category}
        products={products}
      />
    );
  switch (slug[0]) {
    case "panier":
      return <Cart products={products} />;
    case "produits":
      return <Catalog products={products} />;
    case "a-propos":
      return <About />;
    case "contact":
      return <Contact products={products} />;
    case "devis":
      return <Contact quote products={products} productId={produit} />;
    case "livraison":
      return <Delivery />;
    case "conseils":
      return <Resources />;
    case "confidentialite":
      return <Legal />;
    case "conditions":
      return <Legal terms />;
    case "credits":
      return <Credits />;
    default:
      notFound();
  }
}
