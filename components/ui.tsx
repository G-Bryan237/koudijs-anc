"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { ProductMenu } from "./product-menu";
import { PageMotion } from "./page-motion";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { categories, whatsapp, type Locale } from "@/lib/data";

const LanguageContext = createContext<Locale>("fr");
export const useLocale = () => useContext(LanguageContext);
export function Icon({ name, size = 22 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    cart: (
      <>
        <path d="M2 3h3l3 12h11l3-9H6" />
        <circle cx="9" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </>
    ),
    arrow: (
      <>
        <path d="M4 12h15M13 5l7 7-7 7" />
      </>
    ),
    diagonal: (
      <>
        <path d="M6 18 18 6M6 6h12v12" />
      </>
    ),
    chevron: <path d="m8 10 4 4 4-4" />,
    pin: (
      <>
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    truck: (
      <>
        <path d="M2 5h12v13H2zM14 9h4l4 5v4h-8" />
        <circle cx="6" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
      </>
    ),
    chat: (
      <>
        <path d="M20 11.5a8.5 8.5 0 0 1-12.8 7.3L3 20l1.2-4.2A8.5 8.5 0 1 1 20 11.5Z" />
        <path d="M8 8c.5 4 2 5.5 6 6l1-2-2-1-1 1-2-2 1-1-1-2Z" />
      </>
    ),
    fish: (
      <>
        <path d="M3 12s4-6 9-6 8 6 8 6-3 6-8 6-9-6-9-6ZM3 12l-2-4v8l2-4M12 6l-2-3M12 18l-2 3" />
        <circle cx="15" cy="11" r=".8" />
      </>
    ),
    leaf: (
      <>
        <path d="M20 3C8 2 2 9 5 15s15 5 15-12Z" />
        <path d="m3 21 11-11M7 17v-5M10 14h5" />
      </>
    ),
    shield: (
      <>
        <path d="m12 2 8 3v6c0 5-8 10-8 10S4 16 4 11V5Z" />
        <path d="m8 11 3 3 5-6" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 1v2M12 21v2M1 12h2M21 12h2M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2" />
      </>
    ),
    moon: <path d="M20 14A8 8 0 0 1 10 4 8.5 8.5 0 1 0 20 14Z" />,
    menu: <path d="M3 6h18M3 12h18M3 18h18" />,
    close: <path d="m5 5 14 14M5 19 19 5" />,
    phone: (
      <path d="m7 3 3 5-2 2a15 15 0 0 0 6 6l2-2 5 3-2 4C10 21 3 14 3 5Z" />
    ),
    mail: (
      <>
        <rect x="2" y="4" width="20" height="16" rx="1" />
        <path d="m2 5 10 8L22 5" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    box: (
      <>
        <path d="m12 2 9 5v10l-9 5-9-5V7ZM3 7l9 5 9-5M12 12v10M7 4l10 6" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="7" r="3" />
        <path d="M2 21v-4a7 7 0 0 1 14 0v4M17 4a3 3 0 0 1 0 6M19 14a5 5 0 0 1 3 5v2" />
      </>
    ),
    settings: (
      <>
        <path d="M4 5h16M4 12h16M4 19h16" />
        <circle cx="8" cy="5" r="2" />
        <circle cx="16" cy="12" r="2" />
        <circle cx="9" cy="19" r="2" />
      </>
    ),
    search: (
      <>
        <circle cx="10" cy="10" r="6" />
        <path d="m15 15 6 6" />
      </>
    ),
    download: (
      <>
        <path d="M12 2v13m-5-5 5 5 5-5M4 17v5h16v-5" />
      </>
    ),
    logout: (
      <>
        <path d="M9 3H3v18h6M10 12h11m-4-4 4 4-4 4" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.leaf}
    </svg>
  );
}
export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className={`brand ${light ? "brand-light" : ""}`}
      aria-label="Animal Nutrition Cameroon, accueil"
    >
      <span className="brand-mark">
        <svg viewBox="0 0 42 42" fill="none" aria-hidden="true">
          <path
            d="M5 34 18 7h7l13 27H27L21 21l-6 13H5Z"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path d="m18 7 8 17" stroke="currentColor" strokeWidth="3" />
        </svg>
      </span>
      <span>
        ANIMAL NUTRITION<small>CAMEROON LLC</small>
      </span>
    </Link>
  );
}
export function WhatsAppButton({
  subject,
  children,
  secondary = false,
}: {
  subject?: string;
  children?: ReactNode;
  secondary?: boolean;
}) {
  const locale = useLocale();
  return (
    <a
      className={`button ${secondary ? "button-outline" : "button-green"}`}
      href={whatsapp(locale, subject)}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon name="chat" size={19} />
      {children ||
        (locale === "fr"
          ? "Parlons de votre élevage"
          : "Let’s talk about your farm")}
      <Icon name="diagonal" size={17} />
    </a>
  );
}
export function Shell({
  children,
  locale,
  theme,
}: {
  children: ReactNode;
  locale: Locale;
  theme: string;
}) {
  const cart = useCart();
  const [dark, setDark] = useState(theme === "dark");
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const path = usePathname();
  const menu = menuPath === path;
  const setMenu = (open: boolean) => setMenuPath(open ? path : null);
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const cartBadge = useRef<HTMLSpanElement>(null);
  const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const previousQuantity = useRef(quantity);
  useEffect(() => {
    let animation: Animation | undefined;
    if (
      quantity > previousQuantity.current &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      animation = cartBadge.current?.animate(
        [{ scale: 1 }, { scale: 1.18 }, { scale: 1 }],
        { duration: 220, easing: "ease-out" },
      );
    }
    previousQuantity.current = quantity;
    return () => animation?.cancel();
  }, [quantity]);
  useEffect(() => {
    if (!menu) return;
    const dismiss = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setMenuPath(null);
    };
    const desktop = window.matchMedia("(min-width: 1001px)");
    const resize = () => {
      if (desktop.matches) setMenuPath(null);
    };
    document.addEventListener("pointerdown", dismiss);
    desktop.addEventListener("change", resize);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      desktop.removeEventListener("change", resize);
    };
  }, [menu]);
  const router = useRouter();
  const t = (fr: string, en: string) => (locale === "fr" ? fr : en);
  const nav = [
    ["/", t("Accueil", "Home")],
    ["/produits", t("Nos produits", "Our products")],
    ["/a-propos", t("À propos", "About us")],
    ["/conseils", t("Conseils & ressources", "Advice & resources")],
    ["/contact", "Contact"],
  ];
  function switchLanguage(next: Locale) {
    document.cookie = `anc_locale=${next};path=/;max-age=31536000;SameSite=Lax`;
    document.documentElement.lang = next;
    router.refresh();
  }
  function switchTheme() {
    const next =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setDark(next === "dark");
    document.documentElement.dataset.theme = next;
    document.cookie = `anc_theme=${next};path=/;max-age=31536000;SameSite=Lax`;
  }
  return (
    <LanguageContext.Provider value={locale}>
      <PageMotion />
      <a className="skip-link" href="#main">
        {t("Aller au contenu", "Skip to content")}
      </a>
      {!path.startsWith("/admin") && (
        <>
          <div className="utility">
            <div className="container utility-inner">
              <span>
                <Icon name="pin" size={13} />
                Yaoundé, {t("Cameroun", "Cameroon")}
                <i />
                {t("Livraison partout au Cameroun", "Delivery across Cameroon")}
              </span>
              <a href="tel:+237655616109">
                <Icon name="phone" size={13} />
                +237 655 61 61 09
              </a>
            </div>
          </div>
          <header
            ref={header}
            className="header"
            onKeyDown={(event) => {
              if (menu && event.key === "Escape") {
                event.preventDefault();
                setMenuPath(null);
                menuButton.current?.focus();
              }
            }}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget))
                setMenuPath(null);
            }}
          >
            <div className="container header-inner">
              <Brand />
              <nav
                aria-label={t("Navigation principale", "Main navigation")}
                className="desktop-nav"
              >
                {nav.map(([href, label]) =>
                  href === "/produits" ? (
                    <ProductMenu key={href} locale={locale} />
                  ) : (
                    <Link
                      className={
                        path === href ||
                        (href !== "/" && path.startsWith(href + "/"))
                          ? "active"
                          : ""
                      }
                      aria-current={path === href ? "page" : undefined}
                      key={href}
                      href={href}
                    >
                      {label}
                    </Link>
                  ),
                )}
              </nav>
              <div className="header-actions">
                <Link
                  href="/panier"
                  className="header-cart"
                  onClick={() => setMenu(false)}
                  aria-label={t(
                    `Panier, ${cart.length} produits`,
                    `Cart, ${cart.length} products`,
                  )}
                >
                  <Icon name="cart" size={22} />
                  <span className="cart-label">{t("Panier", "Cart")}</span>
                  <span ref={cartBadge} className="cart-count">
                    {cart.length}
                  </span>
                </Link>
                <div className="language" aria-label={t("Langue", "Language")}>
                  <button
                    onClick={() => switchLanguage("fr")}
                    aria-pressed={locale === "fr"}
                  >
                    FR
                  </button>
                  <span>/</span>
                  <button
                    onClick={() => switchLanguage("en")}
                    aria-pressed={locale === "en"}
                  >
                    EN
                  </button>
                </div>
                <button
                  className="icon-button theme-toggle"
                  onClick={switchTheme}
                  aria-label={t(
                    dark ? "Activer le thème clair" : "Activer le thème sombre",
                    dark ? "Use light theme" : "Use dark theme",
                  )}
                >
                  <Icon name={dark ? "sun" : "moon"} size={18} />
                </button>
                <Link
                  href="/devis"
                  className="button button-green header-quote"
                >
                  {t("Demander un devis", "Request a quote")}
                  <Icon name="diagonal" size={15} />
                </Link>
                <button
                  ref={menuButton}
                  className="icon-button menu-toggle"
                  aria-expanded={menu}
                  aria-controls="mobile-navigation"
                  aria-label={t("Menu de navigation", "Navigation menu")}
                  onClick={() => setMenu(!menu)}
                >
                  <span className="menu-lines" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                </button>
              </div>
            </div>
            {menu && (
              <nav
                id="mobile-navigation"
                className="mobile-nav"
                aria-label={t("Navigation mobile", "Mobile navigation")}
              >
                {nav.map(([href, label]) =>
                  href === "/produits" ? (
                    <ProductMenu
                      key={href}
                      locale={locale}
                      mobile
                      onNavigate={() => setMenu(false)}
                    />
                  ) : (
                    <Link
                      key={href}
                      href={href}
                      aria-current={path === href ? "page" : undefined}
                      onClick={() => setMenu(false)}
                    >
                      {label}
                      <Icon name="arrow" size={18} />
                    </Link>
                  ),
                )}
                <Link href="/devis" onClick={() => setMenu(false)}>
                  {t("Demander un devis", "Request a quote")}
                </Link>
              </nav>
            )}
          </header>
        </>
      )}
      {children}
      {!path.startsWith("/admin") && (
        <>
          <footer>
            <div className="container footer-top">
              <div className="footer-brand">
                <Brand light />
                <p>
                  {t(
                    "Aliments et solutions nutritionnelles KOUDIJS pour les pisciculteurs et éleveurs du Cameroun.",
                    "KOUDIJS feed and nutrition solutions for fish and livestock farmers across Cameroon.",
                  )}
                </p>
                <span className="footer-location">
                  <Icon name="pin" size={17} />
                  Yaoundé, {t("Cameroun", "Cameroon")}
                </span>
              </div>
              <div>
                <h3>{t("Nos solutions", "Our solutions")}</h3>
                {categories.map((c) => (
                  <Link key={c.id} href={`/${c.id}`}>
                    {c.name[locale]}
                  </Link>
                ))}
                <Link href="/produits">
                  {t("Tous les produits", "All products")}
                </Link>
              </div>
              <div>
                <h3>{t("À votre service", "Here to help")}</h3>
                <Link href="/a-propos">
                  {t("Notre entreprise", "Our company")}
                </Link>
                <Link href="/conseils">
                  {t("Conseils & ressources", "Advice & resources")}
                </Link>
                <Link href="/livraison">{t("Livraison", "Delivery")}</Link>
                <Link href="/contact">{t("Nous contacter", "Contact us")}</Link>
              </div>
              <div>
                <h3>
                  {t("Parlons de votre élevage", "Let’s talk about your farm")}
                </h3>
                <a href="tel:+237659199943" className="footer-phone">
                  +237 659 199 943
                </a>
                <a href="mailto:info@anc.cm">info@anc.cm</a>
                <p>
                  {t(
                    "Derrière le Commissariat d’Odza",
                    "Behind Odza Police Station",
                  )}
                  <br />
                  Yaoundé, {t("Cameroun", "Cameroon")}
                </p>
              </div>
            </div>
            <div className="container footer-bottom">
              <span>
                © {new Date().getFullYear()} Animal Nutrition Cameroon LLC
              </span>
              <div>
                <Link href="/confidentialite">
                  {t("Confidentialité", "Privacy policy")}
                </Link>
                <Link href="/conditions">
                  {t("Conditions générales", "Terms & conditions")}
                </Link>
                <Link href="/admin">{t("Administration", "Admin")}</Link>
              </div>
            </div>
          </footer>
          <a
            className="floating-whatsapp"
            href={whatsapp(locale)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t(
              "Nous contacter sur WhatsApp",
              "Contact us on WhatsApp",
            )}
          >
            <Icon name="chat" size={26} />
          </a>
        </>
      )}
    </LanguageContext.Provider>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {children}
    </div>
  );
}
export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  const l = useLocale();
  return (
    <section className="page-intro">
      <div className="container">
        <div className="breadcrumb">
          <Link href="/">{l === "fr" ? "Accueil" : "Home"}</Link>
          <span>/</span>
          <span>{eyebrow}</span>
        </div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
export function FinalCTA() {
  const l = useLocale();
  return (
    <section className="final-cta">
      <div className="container">
        <div>
          <span className="eyebrow">
            {l === "fr"
              ? "CHAQUE ÉLEVAGE A SES BESOINS"
              : "EVERY FARM HAS ITS OWN NEEDS"}
          </span>
          <h2>
            {l === "fr"
              ? "Trouvons l’aliment qui vous convient."
              : "Let’s find the feed your farm needs."}
          </h2>
          <p>
            {l === "fr"
              ? "Parlez-nous de vos animaux. Notre équipe vous accompagne dans votre choix."
              : "Tell us about your animals. Our team will help you choose."}
          </p>
        </div>
        <WhatsAppButton />
      </div>
    </section>
  );
}
