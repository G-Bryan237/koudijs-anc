"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { categories, whatsapp, type Product, type Category } from "@/lib/data";
import {
  Icon,
  useLocale,
  WhatsAppButton,
  SectionHeading,
  PageIntro,
  FinalCTA,
} from "./ui";

export function CategoryCards() {
  const l = useLocale();
  return (
    <div className="category-grid">
      {categories.map((c, i) => (
        <Link href={`/${c.id}`} className="category-card" key={c.id}>
          <div className="category-photo">
            <Image
              src={c.image}
              alt={c.animals[l]}
              fill
              sizes="(max-width: 700px) 100vw, 33vw"
            />
            <span className="photo-number">0{i + 1}</span>
          </div>
          <div className="category-body">
            <span className="eyebrow">{c.animals[l]}</span>
            <div className="category-title">
              <h3>{c.name[l]}</h3>
              <span className="square-arrow">
                <Icon name="diagonal" />
              </span>
            </div>
            <p>{c.description[l]}</p>
            <span className="text-link">
              {l === "fr" ? "Découvrir la gamme" : "Explore the range"}
              <Icon name="arrow" size={17} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function Home({ products }: { products: Product[] }) {
  const l = useLocale();
  const t = (fr: string, en: string) => (l === "fr" ? fr : en);
  return (
    <main id="main">
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-copy-inner">
            <span className="eyebrow">
              <span className="green-dot" />
              {t("NUTRITION ANIMALE · CAMEROUN", "ANIMAL NUTRITION · CAMEROON")}
            </span>
            <h1>
              {t("Aliments KOUDIJS", "KOUDIJS feed")}
              <br />
              {t("pour les éleveurs", "for the farmers")}
              <br />
              <span>{t("du Cameroun.", "of Cameroon.")}</span>
            </h1>
            <p>
              {t(
                "Des solutions adaptées à vos poissons, volailles et porcs. Une équipe à Yaoundé pour vous conseiller et organiser votre approvisionnement.",
                "Nutrition for your fish, poultry and pigs. A team in Yaoundé to guide your choices and arrange your feed supply.",
              )}
            </p>
            <div className="hero-buttons">
              <Link className="button button-green" href="/produits">
                {t("Découvrir nos produits", "Explore our products")}
                <Icon name="arrow" size={18} />
              </Link>
              <a
                className="hero-contact"
                href={whatsapp(l)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="chat" size={22} />
                {t("Échanger avec un conseiller", "Talk to our team")}
              </a>
            </div>
            <div className="hero-brandline">
              <span className="koudijs-word">
                koudijs<span>●</span>
              </span>
              <span>
                {t("Distributeur de solutions", "Distributor of animal")}
                <br />
                {t(
                  "de nutrition animale KOUDIJS",
                  "nutrition solutions from KOUDIJS",
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <Image
            src="/images/aquaculture.webp"
            alt={t(
              "Vue aérienne d’étangs d’aquaculture bordés de végétation tropicale",
              "Aerial view of aquaculture ponds surrounded by tropical vegetation",
            )}
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
            priority
          />
          <div className="hero-image-label">
            <span className="tiny-line" />
            {t("AU RYTHME DE VOTRE ÉLEVAGE", "GROWING WITH YOUR FARM")}
          </div>
          <Link href="/aquaculture" className="hero-feature">
            <span className="feature-icon">
              <Icon name="fish" size={30} />
            </span>
            <div>
              <span>
                {t("NOTRE GAMME AQUACULTURE", "OUR AQUACULTURE RANGE")}
              </span>
              <strong>
                {t(
                  "Une nutrition à chaque étape.",
                  "Nutrition at every stage.",
                )}
              </strong>
            </div>
            <Icon name="diagonal" size={23} />
          </Link>
        </div>
      </section>
      <div className="service-strip">
        <div className="container">
          {[
            [
              "shield",
              t("La gamme KOUDIJS", "The KOUDIJS range"),
              t(
                "Des solutions de nutrition reconnues",
                "Established animal nutrition solutions",
              ),
            ],
            [
              "users",
              t("Le conseil, à vos côtés", "Guidance by your side"),
              t(
                "Un échange direct avec notre équipe",
                "A direct conversation with our team",
              ),
            ],
            [
              "truck",
              t("Livraison au Cameroun", "Delivery across Cameroon"),
              t(
                "Un approvisionnement organisé avec vous",
                "Feed supply arranged around your needs",
              ),
            ],
          ].map(([icon, title, text]) => (
            <div key={icon}>
              <Icon name={icon} size={27} />
              <span>
                <strong>{title}</strong>
                <small>{text}</small>
              </span>
            </div>
          ))}
        </div>
      </div>
      <section className="section container">
        <SectionHeading
          eyebrow={t(
            "À CHAQUE ÉLEVAGE, SA SOLUTION",
            "THE RIGHT SOLUTION FOR YOUR FARM",
          )}
          title={t("Qu’élevez-vous ?", "What do you farm?")}
          description={t(
            "Trouvez les aliments adaptés à vos animaux et à leur stade de développement.",
            "Find feed suited to your animals and their stage of development.",
          )}
        >
          <Link href="/produits" className="text-link">
            {t("Tous nos produits", "All our products")}
            <Icon name="arrow" size={19} />
          </Link>
        </SectionHeading>
        <CategoryCards />
      </section>
      <section className="aquaculture-feature container">
        <div className="editorial-image">
          <Image
            src="/images/aquaculture.webp"
            alt={t("Étangs d’élevage de poissons", "Fish farming ponds")}
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
          />
          <span className="image-note">
            {t(
              "AQUACULTURE · TILAPIA & POISSON-CHAT",
              "AQUACULTURE · TILAPIA & CATFISH",
            )}
          </span>
        </div>
        <div className="editorial-copy">
          <span className="eyebrow">
            {t("FOCUS AQUACULTURE", "AQUACULTURE IN FOCUS")}
          </span>
          <h2>
            {t(
              "Du premier aliment\nà la dernière phase.",
              "From the first feed\nto the finishing stage.",
            )}
          </h2>
          <p>
            {t(
              "Les besoins de vos poissons évoluent. Découvrez les aliments KOUDIJS pour tilapia et poisson-chat, avec des formats adaptés aux différentes phases de croissance.",
              "Your fish’s needs change as they grow. Explore KOUDIJS feed for tilapia and catfish, with formats for different growth stages.",
            )}
          </p>
          <div className="stage-line">
            {[
              t("Démarrage", "Starter"),
              t("Croissance", "Grower"),
              t("Finition", "Finisher"),
            ].map((s, i) => (
              <span key={s}>
                <small>0{i + 1}</small>
                {s}
              </span>
            ))}
          </div>
          <Link className="text-link" href="/aquaculture">
            {t("Explorer la gamme aquaculture", "Explore aquaculture feed")}
            <Icon name="arrow" size={19} />
          </Link>
        </div>
      </section>
      <section className="finder-section">
        <div className="container">
          <Finder products={products} />
        </div>
      </section>
      <section className="section container order-section">
        <SectionHeading
          eyebrow={t(
            "SIMPLE, DU CHOIX À LA LIVRAISON",
            "SIMPLE, FROM SELECTION TO DELIVERY",
          )}
          title={t(
            "Votre prochaine commande,\nen quatre étapes.",
            "Your next order,\nin four steps.",
          )}
        />
        <div className="order-steps">
          {[
            [
              t("Choisissez votre gamme", "Choose your range"),
              t(
                "Identifiez votre animal et sa phase de croissance.",
                "Identify your animal and its growth stage.",
              ),
            ],
            [
              t("Parlons de vos besoins", "Tell us what you need"),
              t(
                "Contactez-nous pour les prix et la disponibilité.",
                "Contact us for prices and availability.",
              ),
            ],
            [
              t("Validez votre devis", "Confirm your quotation"),
              t(
                "Confirmez les produits, quantités et modalités.",
                "Confirm products, quantities and payment terms.",
              ),
            ],
            [
              t("Organisons la livraison", "Arrange your delivery"),
              t(
                "Convenez du transport vers votre localité.",
                "Arrange transport to your location.",
              ),
            ],
          ].map(([title, desc], i) => (
            <div key={title}>
              <span className="step-number">0{i + 1}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="delivery-banner container">
        <div className="delivery-icon">
          <Icon name="truck" size={45} />
        </div>
        <div>
          <span className="eyebrow">
            {t("DE YAOUNDÉ À VOTRE ÉLEVAGE", "FROM YAOUNDÉ TO YOUR FARM")}
          </span>
          <h2>
            {t(
              "Nous organisons votre livraison au Cameroun.",
              "We arrange your delivery across Cameroon.",
            )}
          </h2>
          <p>
            {t(
              "Partagez votre localité. Notre équipe vous confirme les frais et les délais avant toute commande.",
              "Share your location. Our team will confirm costs and timing before you order.",
            )}
          </p>
        </div>
        <Link href="/livraison" className="text-link">
          {t("En savoir plus", "Learn more")}
          <Icon name="arrow" size={20} />
        </Link>
      </section>
      <FinalCTA />
    </main>
  );
}

export function Finder({ products }: { products: Product[] }) {
  const l = useLocale(),
    t = (fr: string, en: string) => (l === "fr" ? fr : en);
  const [activity, setActivity] = useState<Category>("aquaculture");
  const [animal, setAnimal] = useState("");
  const [stage, setStage] = useState("");
  const [result, setResult] = useState(false);
  const options = products.filter(
    (p) => p.category === activity && p.available,
  );
  const selected = options.find((p) => p.id === animal);
  return (
    <div className="finder">
      <div className="finder-heading">
        <span className="eyebrow">
          {t("FAISONS LE BON CHOIX", "LET’S FIND YOUR FEED")}
        </span>
        <h2>
          {t(
            "Quel aliment pour\nvotre élevage ?",
            "Which feed suits\nyour farm?",
          )}
        </h2>
        <p>
          {t(
            "Quelques précisions pour vous orienter vers la bonne gamme.",
            "A few details to point you towards the right range.",
          )}
        </p>
      </div>
      <form
        className="finder-form"
        onSubmit={(e) => {
          e.preventDefault();
          setResult(true);
        }}
      >
        <div className="finder-fields">
          <label>
            <span>01</span>
            {t("Votre activité", "Your activity")}
            <select
              value={activity}
              onChange={(e) => {
                setActivity(e.target.value as Category);
                setAnimal("");
                setStage("");
                setResult(false);
              }}
            >
              {categories.map((c) => (
                <option value={c.id} key={c.id}>
                  {c.name[l]}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>02</span>
            {t("Vos animaux", "Your animals")}
            <select
              required
              value={animal}
              onChange={(e) => {
                setAnimal(e.target.value);
                setStage("");
                setResult(false);
              }}
            >
              <option value="">{t("Sélectionner", "Select")}</option>
              {options.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name[l]}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>03</span>
            {t("Phase d’élevage", "Production stage")}
            <select
              required
              value={stage}
              disabled={!selected}
              onChange={(e) => {
                setStage(e.target.value);
                setResult(false);
              }}
            >
              <option value="">{t("Sélectionner", "Select")}</option>
              {selected?.stages[l].split(" · ").map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="finder-bottom">
          <span>
            <Icon name="users" size={17} />
            {t(
              "Notre équipe confirme le choix avec vous.",
              "Our team confirms the choice with you.",
            )}
          </span>
          <button className="button button-green" type="submit">
            {t("Trouver ma gamme", "Find my range")}
            <Icon name="arrow" size={18} />
          </button>
        </div>
        {result && selected && (
          <div className="finder-result" role="status">
            <div>
              <small>{t("Gamme à explorer", "Suggested range")}</small>
              <h3>{selected.name[l]}</h3>
              <p>{stage}</p>
              <Link className="text-link" href={`/produits/${selected.id}`}>
                {t("Voir le produit", "View product")}
                <Icon name="arrow" size={16} />
              </Link>
            </div>
            <WhatsAppButton
              subject={t(
                `connaître la disponibilité de ${selected.name.fr}, phase ${stage}`,
                `availability for ${selected.name.en}, ${stage} stage`,
              )}
            >
              {t("Demander la disponibilité", "Ask about availability")}
            </WhatsAppButton>
          </div>
        )}
      </form>
    </div>
  );
}

export function Catalog({
  products,
  category,
}: {
  products: Product[];
  category?: Category;
}) {
  const l = useLocale(),
    t = (fr: string, en: string) => (l === "fr" ? fr : en);
  const [filter, setFilter] = useState(category || "all");
  const [query, setQuery] = useState("");
  const c = categories.find((c) => c.id === category);
  const shown = products.filter(
    (p) =>
      p.available &&
      (filter === "all" || p.category === filter) &&
      `${p.name[l]} ${p.description[l]}`
        .toLocaleLowerCase(l)
        .includes(query.toLocaleLowerCase(l)),
  );
  return (
    <main id="main">
      <PageIntro
        eyebrow={c?.name[l] || t("Nos produits", "Our products")}
        title={
          c
            ? c.animals[l]
            : t(
                "Une gamme pensée pour votre élevage.",
                "A range for your farm.",
              )
        }
        description={
          c?.description[l] ||
          t(
            "Aliments et concentrés KOUDIJS pour l’aquaculture, la volaille et les porcs. Demandez un devis adapté à vos besoins.",
            "KOUDIJS feed and concentrates for aquaculture, poultry and pigs. Request a quotation for your farm.",
          )
        }
      />
      <section className="container section">
        <div className="catalog-toolbar">
          <div
            className="filter-tabs"
            aria-label={t("Filtrer les produits", "Filter products")}
          >
            {!category &&
              [
                {
                  id: "all",
                  name: { fr: "Tous les produits", en: "All products" },
                },
                ...categories,
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setFilter(c.id)}
                  aria-pressed={filter === c.id}
                >
                  {c.name[l]}
                </button>
              ))}
          </div>
          <label className="search-field">
            <Icon name="search" size={18} />
            <input
              aria-label={t("Rechercher un produit", "Search products")}
              placeholder={t("Rechercher un produit…", "Search products…")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>
        <p className="result-count">
          {shown.length}{" "}
          {t("produit(s) dans cette sélection", "product(s) in this selection")}
        </p>
        <div className="product-grid">
          {shown.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {shown.length === 0 && (
          <div className="empty-state">
            <Icon name="search" size={35} />
            <h2>{t("Aucun produit trouvé", "No products found")}</h2>
            <p>
              {t(
                "Essayez un autre mot ou une autre catégorie.",
                "Try another search or category.",
              )}
            </p>
            <button
              className="button button-outline"
              onClick={() => {
                setQuery("");
                setFilter(category || "all");
              }}
            >
              {t("Réinitialiser", "Reset filters")}
            </button>
          </div>
        )}
      </section>
      <section className="finder-section">
        <div className="container">
          <Finder products={products} />
        </div>
      </section>
      <FinalCTA />
    </main>
  );
}
function ProductCard({ product: p }: { product: Product }) {
  const l = useLocale();
  const c = categories.find((c) => c.id === p.category)!;
  return (
    <article className="product-card">
      <Link href={`/produits/${p.id}`} className="product-photo">
        <Image
          src={c.image}
          alt={c.animals[l]}
          fill
          sizes="(max-width: 700px) 100vw, 33vw"
        />
        <span className="product-brand">KOUDIJS</span>
      </Link>
      <div className="product-card-body">
        <span className="eyebrow">{c.name[l]}</span>
        <Link href={`/produits/${p.id}`}>
          <h2>{p.name[l]}</h2>
        </Link>
        <p className="product-stages">{p.stages[l]}</p>
        <p>{p.description[l]}</p>
        <div className="product-card-bottom">
          <Link className="text-link" href={`/produits/${p.id}`}>
            {l === "fr" ? "Voir le produit" : "View product"}
            <Icon name="arrow" size={17} />
          </Link>
          <Link href={`/devis?produit=${p.id}`} className="price-link">
            {l === "fr" ? "Prix sur demande" : "Request price"}
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ProductDetail({
  product: p,
  products,
}: {
  product: Product;
  products: Product[];
}) {
  const l = useLocale(),
    t = (fr: string, en: string) => (l === "fr" ? fr : en);
  const c = categories.find((c) => c.id === p.category)!;
  return (
    <main id="main">
      <div className="container breadcrumb">
        <Link href="/produits">{t("Nos produits", "Our products")}</Link>
        <span>/</span>
        <Link href={`/${c.id}`}>{c.name[l]}</Link>
        <span>/</span>
        <span>{p.name[l]}</span>
      </div>
      <section className="container product-detail">
        <div className="product-detail-image">
          <Image
            src={c.image}
            alt={c.animals[l]}
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
          />
          <span className="product-brand">KOUDIJS</span>
        </div>
        <div>
          <span className="eyebrow">{c.name[l]}</span>
          <h1>{p.name[l]}</h1>
          <p className="lead">{p.description[l]}</p>
          <dl className="product-specs">
            <div>
              <dt>{t("Marque", "Brand")}</dt>
              <dd>KOUDIJS</dd>
            </div>
            <div>
              <dt>{t("Phases", "Stages")}</dt>
              <dd>{p.stages[l]}</dd>
            </div>
            <div>
              <dt>{t("Conditionnement", "Packaging")}</dt>
              <dd>
                {t("À confirmer avec notre équipe", "Confirm with our team")}
              </dd>
            </div>
            <div>
              <dt>{t("Prix et stock", "Price and stock")}</dt>
              <dd>{t("Sur demande", "On request")}</dd>
            </div>
          </dl>
          <div className="button-row">
            <Link
              href={`/devis?produit=${p.id}`}
              className="button button-green"
            >
              {t("Demander un devis", "Request a quote")}
              <Icon name="arrow" size={18} />
            </Link>
            <WhatsAppButton
              secondary
              subject={t(
                `des informations sur ${p.name.fr}`,
                `information about ${p.name.en}`,
              )}
            >
              WhatsApp
            </WhatsAppButton>
          </div>
          <p className="small-note">
            <Icon name="truck" size={17} />
            {t(
              "Livraison organisée au Cameroun, selon votre localité.",
              "Delivery arranged across Cameroon, depending on your location.",
            )}
          </p>
        </div>
      </section>
      <section className="container details-section">
        <h2>{t("Bien choisir votre aliment", "Choosing your feed")}</h2>
        <div className="detail-columns">
          <div>
            <h3>{t("Informations techniques", "Technical information")}</h3>
            <p>
              {t(
                "Demandez la fiche technique correspondant à la référence disponible. Le dosage, le taux d’incorporation et le programme d’alimentation doivent suivre les indications du fabricant.",
                "Request the technical sheet for the available product reference. Dosage, inclusion rates and feeding programmes must follow the manufacturer’s instructions.",
              )}
            </p>
            <WhatsAppButton
              secondary
              subject={t(
                `la fiche technique de ${p.name.fr}`,
                `the technical data sheet for ${p.name.en}`,
              )}
            >
              {t("Demander la fiche technique", "Request technical sheet")}
            </WhatsAppButton>
          </div>
          <div>
            <h3>{t("Préparez votre demande", "Prepare your enquiry")}</h3>
            <ul className="check-list">
              {[
                t(
                  "Espèce, âge et poids moyen des animaux",
                  "Species, age and average animal weight",
                ),
                t(
                  "Effectif et phase de production",
                  "Number of animals and production stage",
                ),
                t(
                  "Aliment utilisé et objectif de votre demande",
                  "Current feed and purpose of your enquiry",
                ),
                t(
                  "Quantité souhaitée et localité de livraison",
                  "Required quantity and delivery location",
                ),
              ].map((s) => (
                <li key={s}>
                  <Icon name="check" size={18} />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <FAQ />
      </section>
      <section className="container section">
        <SectionHeading
          eyebrow={t("LA MÊME GAMME", "IN THE SAME RANGE")}
          title={t("À découvrir également", "You may also need")}
        />
        <div className="product-grid">
          {products
            .filter(
              (x) => x.category === p.category && x.id !== p.id && x.available,
            )
            .map((x) => (
              <ProductCard key={x.id} product={x} />
            ))}
        </div>
      </section>
      <FinalCTA />
    </main>
  );
}

export function FAQ() {
  const l = useLocale();
  const entries =
    l === "fr"
      ? [
          [
            "Comment connaître le prix et la disponibilité ?",
            "Contactez notre équipe en précisant le produit et la quantité. Les prix, le stock, les frais et les modalités de livraison sont confirmés dans votre devis.",
          ],
          [
            "Livrez-vous dans ma ville ?",
            "La livraison est proposée au Cameroun. Communiquez votre localité et les conditions d’accès pour confirmer la faisabilité, le coût et le délai.",
          ],
          [
            "Comment obtenir un programme d’alimentation ?",
            "Indiquez l’espèce, l’âge, le poids moyen et l’effectif de vos animaux. Notre équipe vous aide à identifier la référence appropriée et à obtenir sa fiche technique.",
          ],
        ]
      : [
          [
            "How do I check price and availability?",
            "Contact our team with the product and quantity you need. Prices, stock, delivery fees and arrangements are confirmed in your quotation.",
          ],
          [
            "Can you deliver to my town?",
            "Delivery is offered within Cameroon. Share your location and access details to confirm feasibility, cost and timing.",
          ],
          [
            "How do I get a feeding programme?",
            "Tell us the species, age, average weight and number of your animals. Our team helps identify an appropriate product and obtain its technical sheet.",
          ],
        ];
  return (
    <div className="faq">
      <h2>
        {l === "fr"
          ? "Vos questions, nos réponses"
          : "Your questions, answered"}
      </h2>
      {entries.map(([q, a]) => (
        <details key={q}>
          <summary>
            {q}
            <Icon name="chevron" size={20} />
          </summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}

export function EnquiryForm({
  products,
  productId = "",
}: {
  products: Product[];
  productId?: string;
}) {
  const l = useLocale(),
    t = (fr: string, en: string) => (l === "fr" ? fr : en);
  const initial = products.find((p) => p.id === productId);
  const [category, setCategory] = useState(initial?.category || "aquaculture");
  const [product, setProduct] = useState(initial?.id || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(form),
          category,
          product,
          locale: l,
          consent: form.get("consent") === "on",
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          response.status === 429
            ? t(
                "Trop de demandes. Réessayez dans 15 minutes ou contactez-nous sur WhatsApp.",
                "Too many requests. Try again in 15 minutes or contact us on WhatsApp.",
              )
            : t(
                "La demande n’a pas pu être enregistrée. Vérifiez les champs et réessayez.",
                "Your enquiry could not be saved. Check the fields and try again.",
              ),
        );
      setReference(data.id);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t(
              "Connexion indisponible. Réessayez.",
              "Connection unavailable. Please retry.",
            ),
      );
    } finally {
      setBusy(false);
    }
  }
  if (reference)
    return (
      <div className="form-success" role="status">
        <span className="success-icon">
          <Icon name="check" size={32} />
        </span>
        <h2>
          {t("Votre demande est enregistrée.", "Your enquiry has been saved.")}
        </h2>
        <p>
          {t(
            "Notre équipe peut maintenant consulter votre demande. Vous pouvez aussi poursuivre l’échange sur WhatsApp.",
            "Our team can now review your enquiry. You can also continue the conversation on WhatsApp.",
          )}
        </p>
        <p className="reference">{reference}</p>
        <WhatsAppButton
          subject={t(
            `suivre ma demande ${reference}`,
            `to follow up on my enquiry ${reference}`,
          )}
        />
        <button className="text-link" onClick={() => setReference("")}>
          {t("Envoyer une autre demande", "Send another enquiry")}
        </button>
      </div>
    );
  return (
    <form className="enquiry-form" onSubmit={submit}>
      <h2>
        {t("Dites-nous ce dont vous avez besoin.", "Tell us what you need.")}
      </h2>
      <p>
        {t(
          "Les champs marqués d’un * sont obligatoires.",
          "Fields marked with * are required.",
        )}
      </p>
      <div className="form-grid">
        <label>
          {t("Votre nom *", "Your name *")}
          <input
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            placeholder={t("Nom et prénom", "Full name")}
          />
        </label>
        <label>
          {t("Téléphone / WhatsApp *", "Phone / WhatsApp *")}
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            pattern="[+0-9\s\(\)\.\-]{7,30}"
            maxLength={30}
            placeholder="+237"
          />
        </label>
        <label>
          {t("Votre localité *", "Your location *")}
          <input
            name="location"
            autoComplete="address-level2"
            minLength={2}
            maxLength={150}
            required
            placeholder={t("Ville ou village", "Town or village")}
          />
        </label>
        <label>
          {t("Votre activité *", "Your activity *")}
          <select
            name="category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value as Category);
              setProduct("");
            }}
          >
            {categories.map((c) => (
              <option value={c.id} key={c.id}>
                {c.name[l]}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t("Produit souhaité", "Product of interest")}
          <select value={product} onChange={(e) => setProduct(e.target.value)}>
            <option value="">
              {t("J’ai besoin d’un conseil", "I need some guidance")}
            </option>
            {products
              .filter((p) => p.category === category && p.available)
              .map((p) => (
                <option value={p.id} key={p.id}>
                  {p.name[l]}
                </option>
              ))}
          </select>
        </label>
        <label>
          {t("Quantité / effectif", "Quantity / animal count")}
          <input
            name="quantity"
            maxLength={100}
            placeholder={t(
              "Ex. 5 sacs ou 500 poissons",
              "E.g. 5 bags or 500 fish",
            )}
          />
        </label>
        <label className="form-full">
          {t("Votre message *", "Your message *")}
          <textarea
            name="message"
            minLength={5}
            maxLength={2000}
            required
            rows={4}
            placeholder={t(
              "Précisez l’âge de vos animaux, la phase d’élevage et votre besoin.",
              "Include your animals’ age, production stage and what you need.",
            )}
          />
        </label>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="consent">
        <input name="consent" type="checkbox" required />
        <span>
          {t(
            "J’accepte que mes informations soient utilisées pour répondre à cette demande, conformément à la ",
            "I agree to my information being used to respond to this enquiry, as described in the ",
          )}
          <Link href="/confidentialite" target="_blank">
            {t("politique de confidentialité", "privacy policy")}
          </Link>
          .
        </span>
      </label>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy} className="button button-green">
        {busy
          ? t("Envoi en cours…", "Sending…")
          : t("Envoyer ma demande", "Send my enquiry")}
        <Icon name="arrow" size={18} />
      </button>
      <small>
        {t(
          "Une demande de devis ne constitue pas une commande confirmée.",
          "A quotation request is not a confirmed order.",
        )}
      </small>
    </form>
  );
}

export function Contact({
  products,
  quote = false,
  productId,
}: {
  products: Product[];
  quote?: boolean;
  productId?: string;
}) {
  const l = useLocale(),
    t = (fr: string, en: string) => (l === "fr" ? fr : en);
  const [map, setMap] = useState(false);
  return (
    <main id="main">
      <PageIntro
        eyebrow={quote ? t("Votre devis", "Your quotation") : "Contact"}
        title={
          quote
            ? t(
                "Préparons votre prochain approvisionnement.",
                "Let’s plan your next feed supply.",
              )
            : t("Parlons de votre élevage.", "Let’s talk about your farm.")
        }
        description={t(
          "Un produit, une question, un projet d’élevage : notre équipe à Yaoundé est à votre écoute.",
          "A product, a question or a farming project: our team in Yaoundé is here to help.",
        )}
      />
      <section className="container section contact-grid">
        <aside className="contact-details">
          <h2>{t("Un échange direct.", "A direct conversation.")}</h2>
          <p>
            {t(
              "Retrouvez-nous derrière le Commissariat d’Odza, à Yaoundé.",
              "Find us behind Odza Police Station in Yaoundé.",
            )}
          </p>
          {[
            ["chat", "WhatsApp", "+237 659 199 943", whatsapp(l)],
            [
              "phone",
              t("Téléphone", "Phone"),
              "+237 655 61 61 09",
              "tel:+237655616109",
            ],
            ["mail", "Email", "info@anc.cm", "mailto:info@anc.cm"],
          ].map(([icon, label, value, href]) => (
            <a className="contact-method" href={href} key={label}>
              <Icon name={icon} size={23} />
              <span>
                <small>{label}</small>
                <strong>{value}</strong>
              </span>
              <Icon name="diagonal" size={18} />
            </a>
          ))}
          <div className="location-card">
            <Icon name="pin" size={24} />
            <h3>{t("Venez nous rencontrer", "Visit us")}</h3>
            <p>
              {t(
                "Derrière le Commissariat d’Odza",
                "Behind Odza Police Station",
              )}
              <br />
              Yaoundé, {t("Cameroun", "Cameroon")}
            </p>
            <p className="small-note">
              {t(
                "Appelez avant de vous déplacer pour convenir de votre visite.",
                "Please call ahead to arrange your visit.",
              )}
            </p>
            <a
              className="text-link"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.google.com/maps/search/?api=1&query=Commissariat+Odza+Yaounde+Cameroon"
            >
              {t("Voir les environs sur Maps", "View the area on Maps")}
              <Icon name="diagonal" size={18} />
            </a>
          </div>
        </aside>
        <EnquiryForm products={products} productId={productId} />
      </section>
      <section className="container map-section">
        {map ? (
          <iframe
            title={t(
              "Carte du quartier Odza à Yaoundé",
              "Map of the Odza area in Yaoundé",
            )}
            src="https://maps.google.com/maps?q=Commissariat%20Odza%20Yaounde%20Cameroon&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="map-placeholder">
            <Icon name="pin" size={35} />
            <h3>Odza, Yaoundé</h3>
            <p>
              {t(
                "Chargez la carte Google Maps du quartier. Google recevra alors les données nécessaires à son affichage.",
                "Load the Google Maps view of the area. Google will then receive the data needed to display it.",
              )}
            </p>
            <button
              className="button button-outline"
              onClick={() => setMap(true)}
            >
              {t("Afficher la carte", "Load the map")}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export function About() {
  const l = useLocale(),
    t = (fr: string, en: string) => (l === "fr" ? fr : en);
  return (
    <main id="main">
      <PageIntro
        eyebrow={t("À propos", "About us")}
        title={t(
          "Votre interlocuteur nutrition à Yaoundé.",
          "Your nutrition contact in Yaoundé.",
        )}
        description={t(
          "Animal Nutrition Cameroon LLC distribue les produits de nutrition animale KOUDIJS aux éleveurs et pisciculteurs du Cameroun.",
          "Animal Nutrition Cameroon LLC distributes KOUDIJS animal nutrition products to livestock and fish farmers in Cameroon.",
        )}
      />
      <section className="container section about-grid">
        <div>
          <span className="eyebrow">ANIMAL NUTRITION CAMEROON LLC</span>
          <h2>
            {t(
              "Les bons produits.\nUn contact de proximité.",
              "The right products.\nA local point of contact.",
            )}
          </h2>
          <p>
            {t(
              "Depuis notre point de contact à Odza, nous vous orientons vers les gammes destinées au tilapia, au poisson-chat, aux poulets de chair, aux pondeuses et aux porcs.",
              "From our location in Odza, we help you explore ranges for tilapia, catfish, broilers, laying hens and pigs.",
            )}
          </p>
          <p>
            {t(
              "Notre rôle est de faciliter votre choix et votre approvisionnement : informations produits, demandes de prix et organisation de la livraison selon votre localité.",
              "We help with product selection and supply: product information, price enquiries and delivery arrangements for your location.",
            )}
          </p>
          <Link href="/contact" className="button button-green">
            {t("Rencontrer notre équipe", "Contact our team")}
            <Icon name="arrow" size={18} />
          </Link>
        </div>
        <div className="about-statement">
          <Icon name="leaf" size={45} />
          <h2>
            {t(
              "Aquaculture.\nVolaille.\nÉlevage porcin.",
              "Aquaculture.\nPoultry.\nPig farming.",
            )}
          </h2>
          <p>
            {t(
              "Trois filières, un même engagement : vous aider à choisir une alimentation adaptée.",
              "Three farming sectors, one commitment: helping you choose suitable nutrition.",
            )}
          </p>
        </div>
      </section>
      <section className="container section">
        <SectionHeading
          eyebrow={t("NOTRE ACCOMPAGNEMENT", "HOW WE HELP")}
          title={t(
            "À vos côtés, concrètement.",
            "Practical support for your farm.",
          )}
        />
        <div className="benefit-grid">
          {[
            [
              "users",
              t("Conseil", "Guidance"),
              t(
                "Échangeons sur votre espèce, son âge et votre phase de production.",
                "Tell us about your species, its age and your production stage.",
              ),
            ],
            [
              "box",
              t("Choix des produits", "Product selection"),
              t(
                "Identifions la gamme et vérifions les références disponibles.",
                "Identify the range and check available product references.",
              ),
            ],
            [
              "chat",
              t("Commande simple", "Simple ordering"),
              t(
                "Validez votre devis directement avec notre équipe.",
                "Confirm your quotation directly with our team.",
              ),
            ],
            [
              "truck",
              t("Livraison organisée", "Delivery arrangements"),
              t(
                "Précisons ensemble les frais, délais et conditions d’accès.",
                "Agree on costs, timing and access requirements together.",
              ),
            ],
          ].map(([icon, title, desc]) => (
            <article key={title}>
              <Icon name={icon} size={30} />
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>
      <FinalCTA />
    </main>
  );
}

export function Delivery() {
  const l = useLocale(),
    t = (fr: string, en: string) => (l === "fr" ? fr : en);
  return (
    <main id="main">
      <PageIntro
        eyebrow={t("Livraison", "Delivery")}
        title={t(
          "De notre point de distribution à votre élevage.",
          "From our distribution point to your farm.",
        )}
        description={t(
          "La livraison est proposée dans tout le Cameroun. Les modalités sont définies avec vous avant la confirmation de commande.",
          "Delivery is offered throughout Cameroon. Arrangements are agreed with you before order confirmation.",
        )}
      />
      <section className="container section detail-columns">
        <div>
          <h2>
            {t("Préparons votre livraison", "Let’s arrange your delivery")}
          </h2>
          <ul className="check-list">
            {[
              t(
                "Votre ville, village et point de repère",
                "Your town, village and a nearby landmark",
              ),
              t(
                "Le produit et la quantité souhaitée",
                "The product and quantity required",
              ),
              t(
                "Les conditions d’accès au site",
                "Access conditions at the site",
              ),
              t(
                "Le nom et le téléphone du réceptionnaire",
                "The recipient’s name and phone number",
              ),
            ].map((s) => (
              <li key={s}>
                <Icon name="check" />
                {s}
              </li>
            ))}
          </ul>
          <WhatsAppButton
            subject={t(
              "organiser une livraison d’aliments KOUDIJS",
              "to arrange a delivery of KOUDIJS feed",
            )}
          />
        </div>
        <div className="info-panel">
          <Icon name="truck" size={38} />
          <h2>
            {t(
              "Un devis avant tout engagement",
              "A quotation before you commit",
            )}
          </h2>
          <p>
            {t(
              "Les frais de transport, la disponibilité des produits et le délai dépendent de votre demande. Aucun délai ni tarif de livraison n’est garanti avant confirmation par notre équipe.",
              "Transport fees, product availability and timing depend on your request. No delivery timing or fee is guaranteed until our team confirms it.",
            )}
          </p>
          <Link href="/devis" className="text-link">
            {t("Préparer ma demande", "Prepare my enquiry")}
            <Icon name="arrow" />
          </Link>
        </div>
      </section>
      <section className="container">
        <FAQ />
      </section>
      <FinalCTA />
    </main>
  );
}
