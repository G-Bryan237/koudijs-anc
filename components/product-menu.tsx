"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { categories, type Locale } from "@/lib/data";
export function ProductMenu({
  locale,
  mobile = false,
  onNavigate,
}: {
  locale: Locale;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  const path = usePathname();
  const active =
    path.startsWith("/produits") || categories.some((c) => path === "/" + c.id);
  const id = mobile ? "mobile-product-links" : "desktop-product-links";
  useEffect(() => {
    if (!open) return;
    function dismiss(e: PointerEvent) {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);
  const close = () => {
    setOpen(false);
    onNavigate?.();
  };
  return (
    <div
      ref={root}
      className={[
        "product-menu",
        mobile ? "product-menu-mobile" : "",
        active ? "active" : "",
      ].join(" ")}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <button
        ref={trigger}
        className="product-menu-trigger"
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
      >
        {locale === "fr" ? "Nos produits" : "Our products"}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div id={id} className="product-menu-panel">
          <span className="product-menu-caption">
            {locale === "fr" ? "LES GAMMES KOUDIJS" : "KOUDIJS PRODUCT RANGES"}
          </span>
          {categories.map((c) => (
            <Link key={c.id} href={"/" + c.id} onClick={close}>
              <strong>{c.name[locale]}</strong>
              <small>{c.animals[locale]}</small>
            </Link>
          ))}
          <Link href="/produits" onClick={close} className="product-menu-all">
            {locale === "fr" ? "Voir tous les produits" : "View all products"}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
