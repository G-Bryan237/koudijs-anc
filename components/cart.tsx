"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { addToCart, setCartQuantity, useCart } from "@/lib/cart";
import { categories, whatsapp, type Product } from "@/lib/data";
import { Icon, PageIntro, useLocale } from "./ui";
export function AddToCart({ product }: { product: Product }) {
  const locale = useLocale();
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const label = `${locale === "fr" ? "Ajouter au panier" : "Add to cart"} : ${product.name[locale]}`;
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  return (
    <div className="cart-add">
      <button
        type="button"
        className="button button-green"
        aria-label={label}
        title={label}
        disabled={!product.available}
        onClick={() => {
          addToCart(product.id);
          setAdded(true);
          if (timer.current) clearTimeout(timer.current);
          timer.current = setTimeout(() => setAdded(false), 2400);
        }}
      >
        <Icon name={added ? "check" : "cart"} size={20} />
      </button>
      <span className="cart-announcement" role="status" aria-atomic="true">
        {added
          ? `${product.name[locale]} — ${locale === "fr" ? "Ajouté au panier" : "Added to cart"}`
          : ""}
      </span>
    </div>
  );
}
export function Cart({ products }: { products: Product[] }) {
  const locale = useLocale();
  const t = (fr: string, en: string) => (locale === "fr" ? fr : en);
  const items = useCart();
  const [removed, setRemoved] = useState<{
    id: string;
    quantity: number;
    name: string;
  } | null>(null);
  const rows = items.map((item) => ({
    ...item,
    product: products.find((p) => p.id === item.id && p.available),
  }));
  const available = rows.filter((row) => row.product);
  const total = available.reduce((sum, row) => sum + row.quantity, 0);
  const subject =
    t("un devis pour mon panier :\n", "a quotation for my cart:\n") +
    available
      .map(
        (row) =>
          `${row.product!.name[locale]}${row.product!.pelletSize ? ` (${row.product!.pelletSize})` : ""} — ${row.quantity} kg`,
      )
      .join("\n") +
    t(
      "\nMerci de confirmer le prix, le conditionnement et la livraison",
      "\nPlease confirm pricing, packaging and delivery",
    );
  return (
    <main id="main">
      <PageIntro
        eyebrow={t("PANIER", "CART")}
        title={t("Votre panier", "Your shopping cart")}
        description={t(
          "Retrouvez vos aliments et ajustez les quantités avant de demander votre devis.",
          "Review your feed and adjust quantities before requesting your quotation.",
        )}
      />
      {removed && (
        <div className="container cart-undo">
          <p role="status">
            {removed.name} — {t("retiré du panier", "removed from cart")}
          </p>
          <button
            type="button"
            className="text-link"
            onClick={() => {
              const current =
                items.find((item) => item.id === removed.id)?.quantity || 0;
              setCartQuantity(
                removed.id,
                Math.min(9999, current + removed.quantity),
              );
              setRemoved(null);
            }}
          >
            {t("Annuler", "Undo")} <Icon name="arrow" size={16} />
          </button>
        </div>
      )}
      <section className="container section cart-layout">
        {rows.length === 0 ? (
          <div className="cart-empty">
            <Icon name="cart" size={48} />
            <h2>{t("Votre panier est vide", "Your cart is empty")}</h2>
            <p>
              {t(
                "Découvrez nos aliments et ajoutez les produits adaptés à votre élevage.",
                "Explore our feed and add the products your farm needs.",
              )}
            </p>
            <Link className="button button-green" href="/produits">
              {t("Découvrir les produits", "Browse products")}
              <Icon name="arrow" size={18} />
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              <Link className="text-link" href="/produits">
                {t("Continuer mes achats", "Continue shopping")}
                <Icon name="arrow" size={17} />
              </Link>
              {rows.map(({ id, quantity, product }) => (
                <article className="cart-item" key={id}>
                  {product ? (
                    <>
                      <Link href={`/produits/${id}`} className="cart-image">
                        <Image
                          src={
                            product.image ||
                            categories.find((c) => c.id === product.category)!
                              .image
                          }
                          alt={product.name[locale]}
                          fill
                          sizes="100px"
                        />
                      </Link>
                      <div className="cart-item-info">
                        <span className="eyebrow">KOUDIJS</span>
                        <h2>
                          <Link href={`/produits/${id}`}>
                            {product.name[locale]}
                          </Link>
                        </h2>
                        {product.pelletSize && <p>{product.pelletSize}</p>}
                        <p>{t("Prix sur demande", "Price on request")}</p>
                      </div>
                      <div className="cart-item-controls">
                        <label htmlFor={`quantity-${id}`}>
                          {t("Quantité (kg)", "Quantity (kg)")}
                        </label>
                        <div className="cart-quantity">
                          <button
                            type="button"
                            disabled={quantity <= 1}
                            aria-label={t(
                              `Diminuer ${product.name.fr}`,
                              `Decrease ${product.name.en}`,
                            )}
                            onClick={() => setCartQuantity(id, quantity - 1)}
                          >
                            −
                          </button>
                          <input
                            id={`quantity-${id}`}
                            type="number"
                            min={1}
                            max={9999}
                            step={1}
                            value={quantity}
                            onChange={(e) =>
                              setCartQuantity(id, Number(e.target.value) || 1)
                            }
                          />
                          <button
                            type="button"
                            disabled={quantity >= 9999}
                            aria-label={t(
                              `Augmenter ${product.name.fr}`,
                              `Increase ${product.name.en}`,
                            )}
                            onClick={() => setCartQuantity(id, quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="cart-remove"
                          onClick={() => {
                            setRemoved({
                              id,
                              quantity,
                              name: product.name[locale],
                            });
                            setCartQuantity(id, 0);
                          }}
                          aria-label={t(
                            `Retirer ${product.name.fr}`,
                            `Remove ${product.name.en}`,
                          )}
                        >
                          {t("Retirer", "Remove")}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="cart-unavailable">
                      <p>
                        {t(
                          "Ce produit n’est plus disponible.",
                          "This product is no longer available.",
                        )}
                      </p>
                      <button
                        type="button"
                        className="text-link"
                        onClick={() => setCartQuantity(id, 0)}
                      >
                        {t("Retirer du panier", "Remove from cart")}
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
            <aside className="cart-summary">
              <span className="eyebrow">
                {t("VOTRE SÉLECTION", "YOUR SELECTION")}
              </span>
              <h2>{t("Récapitulatif", "Order summary")}</h2>
              <dl>
                <div>
                  <dt>{t("Produits disponibles", "Available products")}</dt>
                  <dd>{available.length}</dd>
                </div>
                <div>
                  <dt>{t("Quantité totale", "Total quantity")}</dt>
                  <dd>{total} kg</dd>
                </div>
                <div>
                  <dt>{t("Total et livraison", "Total and delivery")}</dt>
                  <dd>{t("Sur devis", "On quotation")}</dd>
                </div>
              </dl>
              <p>
                {t(
                  "Notre équipe confirme les prix, le conditionnement et les frais de livraison avant validation. Les quantités souhaitées sont indiquées en kilogrammes.",
                  "Our team confirms prices, packaging and delivery costs before you approve your order. Requested quantities are in kilograms.",
                )}
              </p>
              {available.length > 0 && (
                <a
                  className="button button-green"
                  href={whatsapp(locale, subject)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="chat" size={19} />
                  {t("Demander le devis du panier", "Request cart quotation")}
                </a>
              )}
              <p className="small-note">
                {t(
                  "Votre sélection sera ouverte dans WhatsApp pour envoi à notre équipe.",
                  "Your selection will open in WhatsApp for you to send to our team.",
                )}
              </p>
            </aside>
          </>
        )}
      </section>
    </main>
  );
}
