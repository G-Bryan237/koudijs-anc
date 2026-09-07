"use client";
import Link from "next/link";
import { ResourceNotes } from "./resource-notes";
import { PageIntro, FinalCTA, useLocale, Icon, WhatsAppButton } from "./ui";
import { type Bilingual } from "@/lib/data";

export const articles: {
  id: string;
  category: Bilingual;
  title: Bilingual;
  intro: Bilingual;
  sections: { title: Bilingual; text: Bilingual }[];
}[] = [
  {
    id: "preparer-sa-demande",
    category: { fr: "GUIDE PRATIQUE", en: "PRACTICAL GUIDE" },
    title: {
      fr: "Bien préparer votre demande de nutrition",
      en: "Preparing your nutrition enquiry",
    },
    intro: {
      fr: "Les informations utiles pour obtenir une réponse adaptée à votre élevage.",
      en: "The information that helps our team respond to your farm’s needs.",
    },
    sections: [
      {
        title: { fr: "Décrivez votre élevage", en: "Describe your farm" },
        text: {
          fr: "Indiquez l’espèce, le nombre d’animaux, l’âge et le poids moyen si vous le connaissez. Pour un lot de volailles, précisez s’il s’agit de poulets de chair ou de pondeuses. Pour les porcs, indiquez la phase de production.",
          en: "Share the species, animal count, age and average weight if known. For poultry, specify whether you raise broilers or layers. For pigs, include the production stage.",
        },
      },
      {
        title: {
          fr: "Présentez l’aliment utilisé",
          en: "Describe the current feed",
        },
        text: {
          fr: "Conservez le nom de la référence et une photo lisible de l’étiquette de l’aliment actuel. Mentionnez les autres ingrédients utilisés si vous préparez un mélange. Ces éléments permettent de mieux comprendre votre demande.",
          en: "Keep the product reference and a readable photograph of your current feed label. Include other ingredients if you prepare a mix. This gives the team useful context for your request.",
        },
      },
      {
        title: {
          fr: "Précisez votre besoin logistique",
          en: "Include supply details",
        },
        text: {
          fr: "Ajoutez la quantité recherchée, votre localité et la date souhaitée. L’équipe pourra vérifier la disponibilité et vous transmettre les modalités avant confirmation.",
          en: "Include the quantity needed, your location and preferred date. The team can check availability and share arrangements before confirmation.",
        },
      },
    ],
  },
  {
    id: "lire-une-fiche-produit",
    category: { fr: "INFORMATIONS PRODUITS", en: "PRODUCT INFORMATION" },
    title: {
      fr: "Les points à vérifier sur une fiche produit",
      en: "What to check on a product sheet",
    },
    intro: {
      fr: "La référence exacte compte autant que la catégorie de l’animal.",
      en: "The exact product reference matters as much as the animal category.",
    },
    sections: [
      {
        title: {
          fr: "Identifiez le type de produit",
          en: "Identify the product type",
        },
        text: {
          fr: "Un aliment complet et un concentré n’ont pas le même mode d’emploi. Vérifiez la désignation du fabricant et demandez la fiche correspondant exactement à la référence proposée.",
          en: "Complete feed and concentrate have different directions for use. Check the manufacturer’s designation and request the sheet matching the exact product reference offered.",
        },
      },
      {
        title: {
          fr: "Vérifiez l’espèce et la phase",
          en: "Check species and stage",
        },
        text: {
          fr: "Lisez les indications de destination du produit : espèce, stade de croissance ou de reproduction. Si un point est absent ou peu clair, demandez une confirmation avant l’achat.",
          en: "Read the product’s intended use: species, growth stage or reproductive stage. If anything is missing or unclear, ask for confirmation before buying.",
        },
      },
      {
        title: {
          fr: "Demandez les instructions complètes",
          en: "Request full instructions",
        },
        text: {
          fr: "Les indications d’utilisation, de mélange, de conservation et de traçabilité doivent être celles de la référence livrée. Ne déduisez pas un dosage à partir d’un autre produit ou d’une simple affiche commerciale.",
          en: "Usage, mixing, storage and traceability information should match the delivered product. Do not infer a dosage from another product or a promotional flyer.",
        },
      },
    ],
  },
  {
    id: "recevoir-sa-livraison",
    category: { fr: "APPROVISIONNEMENT", en: "FEED SUPPLY" },
    title: {
      fr: "Préparer la réception de vos aliments",
      en: "Preparing to receive your feed",
    },
    intro: {
      fr: "Une liste simple pour organiser votre commande et sa réception.",
      en: "A simple checklist to organise your order and delivery.",
    },
    sections: [
      {
        title: {
          fr: "Confirmez les détails par écrit",
          en: "Confirm the details in writing",
        },
        text: {
          fr: "Avant validation, vérifiez les références, les quantités, le prix, les frais de transport et le lieu de livraison figurant sur le devis. Conservez votre confirmation.",
          en: "Before approving, check the product references, quantities, price, transport cost and delivery location on the quotation. Keep the confirmation.",
        },
      },
      {
        title: {
          fr: "Organisez l’accès et la réception",
          en: "Arrange access and receipt",
        },
        text: {
          fr: "Communiquez un numéro joignable et un point de repère précis. Signalez à l’avance les contraintes d’accès pour que les modalités de transport soient adaptées.",
          en: "Provide a reachable phone number and a precise landmark. Mention access restrictions in advance so transport arrangements can take them into account.",
        },
      },
      {
        title: { fr: "Contrôlez votre livraison", en: "Check your delivery" },
        text: {
          fr: "À réception, comparez les produits à la commande et vérifiez l’état des emballages. Conservez les références des lots et contactez l’équipe si vous constatez une anomalie. Suivez les consignes de conservation du fabricant.",
          en: "On receipt, compare the products against your order and check packaging condition. Keep batch references and contact the team if something is wrong. Follow the manufacturer’s storage instructions.",
        },
      },
    ],
  },
];
export function Resources({ slug }: { slug?: string }) {
  const l = useLocale();
  const article = articles.find((a) => a.id === slug);
  return (
    <main id="main">
      <PageIntro
        eyebrow={l === "fr" ? "Conseils & ressources" : "Advice & resources"}
        title={
          article
            ? article.title[l]
            : l === "fr"
              ? "Des repères pour vos décisions."
              : "Practical guidance for your decisions."
        }
        description={
          article
            ? article.intro[l]
            : l === "fr"
              ? "Des guides concrets pour choisir vos produits et préparer votre approvisionnement."
              : "Practical guides for product selection and planning your feed supply."
        }
      />
      {article ? (
        <article className="container article-content">
          <Link className="text-link" href="/conseils">
            {l === "fr" ? "Retour aux ressources" : "Back to resources"}
          </Link>
          {article.sections.map((s) => (
            <section key={s.title.en}>
              <h2>{s.title[l]}</h2>
              <p>{s.text[l]}</p>
            </section>
          ))}
          <WhatsAppButton />
        </article>
      ) : (
        <section className="container section">
          <div className="resource-grid">
            {articles.map((a, i) => (
              <Link
                className="resource-card"
                key={a.id}
                href={`/conseils/${a.id}`}
              >
                <div className="resource-symbol">
                  <Icon name={["users", "box", "truck"][i]} size={48} />
                  <span>0{i + 1}</span>
                </div>
                <span className="eyebrow">{a.category[l]}</span>
                <h2>{a.title[l]}</h2>
                <p>{a.intro[l]}</p>
                <span className="text-link">
                  {l === "fr" ? "Lire le guide" : "Read guide"}
                  <Icon name="arrow" size={18} />
                </span>
              </Link>
            ))}
          </div>
          <ResourceNotes />
          <div className="support-panel">
            <div>
              <h2>
                {l === "fr"
                  ? "Une question sur votre élevage ?"
                  : "Have a question about your farm?"}
              </h2>
              <p>
                {l === "fr"
                  ? "Partagez les détails de votre activité pour obtenir les informations de la gamme concernée."
                  : "Share details of your farm to request information on the relevant product range."}
              </p>
            </div>
            <Link className="button button-green" href="/contact">
              {l === "fr" ? "Contacter notre équipe" : "Contact our team"}
              <Icon name="arrow" size={18} />
            </Link>
          </div>
        </section>
      )}
      <FinalCTA />
    </main>
  );
}

export function Legal({ terms = false }: { terms?: boolean }) {
  const l = useLocale();
  const privacy =
    l === "fr"
      ? [
          [
            "Qui traite vos informations ?",
            "Animal Nutrition Cameroon LLC, derrière le Commissariat d’Odza, Yaoundé, Cameroun. Pour toute question sur vos informations personnelles : info@anc.cm ou +237 659 199 943.",
          ],
          [
            "Informations recueillies",
            "Le formulaire recueille votre nom, téléphone, localité, activité d’élevage, produit recherché, quantité et message. La date, la référence de la demande et son état de traitement sont enregistrés. Ne transmettez pas d’informations sensibles dans le message.",
          ],
          [
            "Utilisation de vos informations",
            "Ces informations servent à répondre à votre demande, préparer un devis et organiser les échanges relatifs à votre approvisionnement. Le formulaire vous demande votre accord avant l’enregistrement. Les informations ne sont pas utilisées pour de la publicité dans cette version du site.",
          ],
          [
            "Accès et conservation",
            "Les demandes sont accessibles à l’administrateur authentifié. Elles sont conservées pour le suivi commercial et doivent être supprimées lorsqu’elles ne sont plus nécessaires, sous réserve des obligations applicables aux transactions. Contactez-nous pour demander un accès, une correction ou une suppression, ou retirer votre accord pour les échanges futurs.",
          ],
          [
            "Cookies et préférences",
            "Le site conserve vos choix de langue et de thème dans deux cookies pendant un an. Un cookie de session strictement nécessaire, valable huit heures, protège l’accès administrateur. Aucun outil publicitaire ni service de mesure d’audience n’est intégré. Une empreinte non lisible de l’adresse réseau est conservée dans un compteur temporaire de 15 minutes pour limiter les tentatives abusives.",
          ],
          [
            "Services externes",
            "Les liens WhatsApp ouvrent un service de Meta. Les liens cartographiques ouvrent Google Maps. La carte intégrée Google Maps se charge automatiquement à proximité de la section de localisation. Ces services traitent des données selon leurs propres politiques. Les photographies sont servies depuis le site.",
          ],
          [
            "Vos demandes",
            "Écrivez à info@anc.cm avec la référence de votre demande, si vous en disposez. Nous pourrons vous demander les éléments nécessaires à la vérification de votre identité avant de communiquer ou modifier vos informations.",
          ],
        ]
      : [
          [
            "Who handles your information?",
            "Animal Nutrition Cameroon LLC, behind Odza Police Station, Yaoundé, Cameroon. For questions about your personal information: info@anc.cm or +237 659 199 943.",
          ],
          [
            "Information collected",
            "The form collects your name, phone, location, farming activity, product of interest, quantity and message. The date, enquiry reference and processing status are also recorded. Do not include sensitive information in your message.",
          ],
          [
            "How your information is used",
            "Information is used to respond to your request, prepare a quotation and discuss your feed supply. The form asks for your agreement before saving the request. Information is not used for advertising in this version of the website.",
          ],
          [
            "Access and retention",
            "Enquiries are accessible to the authenticated administrator. They are kept for commercial follow-up and should be deleted when no longer needed, subject to applicable transaction record obligations. Contact us to request access, correction or deletion, or to withdraw your agreement to future exchanges.",
          ],
          [
            "Cookies and preferences",
            "The website stores language and theme preferences in two cookies for one year. A necessary eight-hour session cookie protects administrator access. No advertising tools or audience analytics services are integrated. A keyed digest of the network address is kept in a temporary 15-minute counter to limit abusive attempts.",
          ],
          [
            "External services",
            "WhatsApp links open a Meta service. Map links open Google Maps. The embedded Google Map loads automatically near the location section. These services process data under their own policies. Photographs are served from this website.",
          ],
          [
            "Your requests",
            "Email info@anc.cm with your enquiry reference if you have it. We may request information needed to verify your identity before sharing or changing your personal information.",
          ],
        ];
  const conditions =
    l === "fr"
      ? [
          [
            "Éditeur et objet du site",
            "Ce site présente les produits distribués par Animal Nutrition Cameroon LLC, derrière le Commissariat d’Odza, Yaoundé, Cameroun. Contact : info@anc.cm, +237 659 199 943. L’entreprise se présente comme distributeur de produits KOUDIJS, sans revendication d’exclusivité.",
          ],
          [
            "Informations produits",
            "Les descriptions sont destinées à orienter votre demande. La référence exacte, les spécifications, le conditionnement, le prix et la disponibilité sont confirmés par l’équipe. Pour l’utilisation, suivez la fiche technique et l’étiquette du fabricant correspondant au produit livré. Aucun résultat d’élevage n’est garanti par les textes du site.",
          ],
          [
            "Demandes et commandes",
            "L’envoi d’un formulaire ou d’un message WhatsApp constitue une demande d’information ou de devis. Il ne vaut ni acceptation de commande ni réservation de stock. Les produits, quantités, prix et modalités doivent être acceptés par les deux parties avant confirmation.",
          ],
          [
            "Paiement et livraison",
            "Le site ne collecte aucun paiement. Les moyens, échéances de paiement et frais de transport sont précisés dans le devis. La livraison au Cameroun dépend de la localité, des conditions d’accès et de la disponibilité confirmée. Aucun délai affiché sur le site ne constitue un engagement de livraison.",
          ],
          [
            "Réception et réclamations",
            "Vérifiez les références, quantités et emballages à réception. Signalez toute anomalie à l’équipe avec la référence de commande et, si possible, des photographies. Les conditions applicables à une annulation, un retour ou un remboursement sont à préciser au devis, sans préjudice des droits impératifs applicables.",
          ],
          [
            "Propriété intellectuelle",
            "Les marques citées appartiennent à leurs titulaires respectifs. Les photographies illustrent les filières et ne représentent pas nécessairement les installations ou les clients de l’entreprise. Les crédits photographiques sont accessibles sur la page dédiée.",
          ],
          [
            "Contact et différends",
            "En cas de difficulté, contactez d’abord Animal Nutrition Cameroon LLC à info@anc.cm pour rechercher une solution. Ces conditions ne privent pas les utilisateurs des protections obligatoires prévues par le droit applicable au Cameroun.",
          ],
        ]
      : [
          [
            "Publisher and website purpose",
            "This website presents products distributed by Animal Nutrition Cameroon LLC, behind Odza Police Station, Yaoundé, Cameroon. Contact: info@anc.cm, +237 659 199 943. The company describes itself as a distributor of KOUDIJS products and does not claim exclusivity.",
          ],
          [
            "Product information",
            "Descriptions help guide your enquiry. The exact reference, specifications, packaging, price and availability are confirmed by the team. Follow the manufacturer’s technical sheet and label for the delivered product. Website content does not guarantee farming outcomes.",
          ],
          [
            "Enquiries and orders",
            "Submitting a form or WhatsApp message is an information or quotation request. It does not confirm an order or reserve stock. Products, quantities, prices and arrangements must be agreed by both parties before confirmation.",
          ],
          [
            "Payment and delivery",
            "The website does not collect payment. Payment methods, deadlines and transport charges are specified in the quotation. Cameroon delivery depends on location, access conditions and confirmed availability. Website content does not promise a delivery date.",
          ],
          [
            "Receipt and complaints",
            "Check product references, quantities and packaging on receipt. Report any issue to the team with the order reference and photographs where possible. Cancellation, return and refund arrangements should be specified in the quotation, without affecting mandatory rights under applicable law.",
          ],
          [
            "Intellectual property",
            "Referenced trademarks belong to their respective owners. Photographs illustrate farming sectors and do not necessarily show the company’s premises or customers. Photography credits are available on the credits page.",
          ],
          [
            "Contact and disputes",
            "For a problem, first contact Animal Nutrition Cameroon LLC at info@anc.cm to seek a resolution. These terms do not remove mandatory user protections under applicable Cameroon law.",
          ],
        ];
  return (
    <main id="main">
      <PageIntro
        eyebrow={l === "fr" ? "Informations légales" : "Legal information"}
        title={
          terms
            ? l === "fr"
              ? "Conditions générales"
              : "Terms & conditions"
            : l === "fr"
              ? "Politique de confidentialité"
              : "Privacy policy"
        }
        description={
          l === "fr"
            ? "Version du 7 septembre 2026."
            : "Version dated 7 September 2026."
        }
      />
      <article className="container article-content">
        {(terms ? conditions : privacy).map(([title, text]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </section>
        ))}
        <Link className="text-link" href="/credits">
          {l === "fr" ? "Crédits photographiques" : "Photography credits"}
          <Icon name="arrow" size={18} />
        </Link>
      </article>
    </main>
  );
}
export function Credits() {
  const l = useLocale();
  return (
    <main id="main">
      <PageIntro
        eyebrow={l === "fr" ? "Crédits" : "Credits"}
        title={l === "fr" ? "Des photographies réelles." : "Real photography."}
        description={
          l === "fr"
            ? "Ces photographies illustrent les filières. Elles ne sont pas présentées comme des installations ou des clients d’Animal Nutrition Cameroon."
            : "These photographs illustrate the farming sectors. They are not presented as Animal Nutrition Cameroon premises or customers."
        }
      />
      <div className="container article-content">
        <p>
          <a href="https://unsplash.com/photos/v8k_Q4ZjdpY">
            Aquaculture: Aleksandr Galichkin, Unsplash. Pa Klok, Thailand.
          </a>
        </p>
        <p>
          <a href="https://unsplash.com/photos/OnKIsDLCeZ8">
            Poultry: Jenny Hill, Unsplash.
          </a>
        </p>
        <p>
          <a href="https://unsplash.com/photos/vMjrs3C50d8">
            Pigs: Zoe Richardson, Unsplash. Pasture Song Farm, Pennsylvania.
          </a>
        </p>
        <p>
          <a href="https://unsplash.com/license">Unsplash License</a>
        </p>
      </div>
    </main>
  );
}
