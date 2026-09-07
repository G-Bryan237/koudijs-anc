"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, type FormEvent } from "react";
import { Brand, Icon, useLocale } from "./ui";
import {
  categories,
  statuses,
  statusNames,
  type Product,
  type Enquiry,
} from "@/lib/data";

export function AdminLogin({ ready }: { ready: boolean }) {
  const l = useLocale(),
    t = (fr: string, en: string) => (l === "fr" ? fr : en);
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok)
        throw new Error(
          res.status === 429
            ? t(
                "Trop de tentatives. Réessayez dans 15 minutes.",
                "Too many attempts. Try again in 15 minutes.",
              )
            : t(
                "Identifiants incorrects ou accès indisponible.",
                "Incorrect credentials or access unavailable.",
              ),
        );
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("Connexion impossible.", "Could not connect."),
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <main id="main" className="login-page">
      <aside className="login-aside">
        <Brand light />
        <div>
          <span
            className="eyebrow"
            style={{ color: "#a9c6a4", marginBottom: 25 }}
          >
            ANIMAL NUTRITION CAMEROON
          </span>
          <h1>
            {t(
              "Votre activité.\nUne vue d’ensemble.",
              "Your business.\nA clearer overview.",
            )}
          </h1>
          <p>
            {t(
              "Retrouvez vos produits, suivez les demandes de vos clients et préparez leurs prochaines commandes.",
              "Manage your products, follow customer enquiries and prepare their next orders.",
            )}
          </p>
        </div>
        <small>Yaoundé, Cameroun · KOUDIJS</small>
      </aside>
      <div className="login-main">
        <form className="login-form" onSubmit={login}>
          <span className="eyebrow">
            {t("ESPACE ADMINISTRATEUR", "ADMINISTRATOR AREA")}
          </span>
          <h2>{t("Connexion", "Sign in")}</h2>
          <p>
            {t(
              "Accédez à votre tableau de bord sécurisé.",
              "Access your protected business dashboard.",
            )}
          </p>
          {!ready && (
            <p role="status" className="admin-notice">
              {t(
                "L’accès administrateur doit être configuré sur le serveur avant la connexion. Consultez le guide du projet.",
                "Administrator access must be configured on the server before signing in. See the project guide.",
              )}
            </p>
          )}
          <label>
            {t("Adresse email", "Email address")}
            <input
              name="email"
              type="email"
              autoComplete="username"
              required
              placeholder="info@anc.cm"
            />
          </label>
          <label>
            {t("Mot de passe", "Password")}
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              maxLength={256}
            />
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy || !ready}
            className="button button-green"
          >
            {busy
              ? t("Connexion…", "Signing in…")
              : t("Se connecter", "Sign in")}
            <Icon name="arrow" size={18} />
          </button>
          <p className="login-note">
            {t(
              "Accès réservé à l’équipe. Pour réinitialiser l’accès, contactez la personne qui gère votre serveur.",
              "Team access only. To reset access, contact the person managing your server.",
            )}
          </p>
          <Link className="text-link" href="/">
            {t("Retour au site", "Back to website")}
            <Icon name="arrow" size={17} />
          </Link>
        </form>
      </div>
    </main>
  );
}

export function Dashboard({
  initialProducts,
  initialEnquiries,
  domain,
}: {
  initialProducts: Product[];
  initialEnquiries: Enquiry[];
  domain: string | null;
}) {
  const l = useLocale(),
    t = (fr: string, en: string) => (l === "fr" ? fr : en);
  const router = useRouter();
  const [tab, setTab] = useState("overview");
  const [products, setProducts] = useState(initialProducts);
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (selected && dialog.current && !dialog.current.open)
      dialog.current.showModal();
  }, [selected]);
  const nav = [
    ["overview", "grid", t("Vue d’ensemble", "Overview")],
    ["products", "box", t("Produits", "Products")],
    ["enquiries", "mail", t("Demandes & devis", "Enquiries & quotes")],
    ["orders", "truck", t("Commandes", "Orders")],
    ["customers", "users", t("Contacts", "Contacts")],
    ["settings", "settings", t("Paramètres", "Settings")],
  ];
  async function reload() {
    const response = await fetch("/api/admin", { cache: "no-store" });
    if (!response.ok)
      throw new Error(
        t(
          "Session expirée. Reconnectez-vous.",
          "Session expired. Sign in again.",
        ),
      );
    const data = await response.json();
    setProducts(data.products);
    setEnquiries(data.enquiries);
  }
  async function update(data: object) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const res = await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok)
        throw new Error(
          t(
            "La modification n’a pas été enregistrée.",
            "The update could not be saved.",
          ),
        );
      await reload();
      setNotice(t("Modifications enregistrées.", "Changes saved."));
      setSelected(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    setError("");
    try {
      const res = await fetch("/api/admin/session", { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError(
        t(
          "La déconnexion a échoué. Réessayez.",
          "Sign-out failed. Please retry.",
        ),
      );
    }
  }
  function changeTab(value: string) {
    setTab(value);
    setFilter("all");
    setQuery("");
    setNotice("");
    setError("");
  }
  const orders = enquiries.filter((e) =>
    ["confirmed", "delivered"].includes(e.status),
  );
  const rows = (tab === "orders" ? orders : enquiries).filter(
    (e) =>
      (filter === "all" || e.status === filter) &&
      `${e.name} ${e.phone} ${e.id} ${e.location}`
        .toLocaleLowerCase()
        .includes(query.toLocaleLowerCase()),
  );
  const customers = Array.from(
    new Map(enquiries.map((e) => [e.phone.replace(/\D/g, ""), e])).values(),
  );
  function exportCSV() {
    const cell = (v: string) =>
      `"${(/^[=+\-@\t\r]/.test(v) ? "'" : "") + v.replaceAll('"', '""')}"`;
    const header = [
      "Reference",
      "Date",
      "Name",
      "Phone",
      "Location",
      "Product",
      "Quantity",
      "Status",
      "Message",
    ];
    const text =
      "\uFEFF" +
      [
        header,
        ...rows.map((e) => [
          e.id,
          e.createdAt,
          e.name,
          e.phone,
          e.location,
          products.find((p) => p.id === e.product)?.name[l] || e.category,
          e.quantity,
          statusNames[e.status][l],
          e.message,
        ]),
      ]
        .map((row) => row.map(cell).join(","))
        .join("\r\n");
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/csv;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "anc-enquiries.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  function renderTable(items: Enquiry[]) {
    return items.length ? (
      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t("Client", "Customer")}</th>
              <th>{t("Produit / localité", "Product / location")}</th>
              <th>{t("Date", "Date")}</th>
              <th>{t("Statut", "Status")}</th>
              <th>{t("Détails", "Details")}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((e) => (
              <tr key={e.id}>
                <td>
                  <strong>{e.name}</strong>
                  <small>{e.id}</small>
                </td>
                <td>
                  {products.find((p) => p.id === e.product)?.name[l] ||
                    categories.find((c) => c.id === e.category)?.name[l]}
                  <small>{e.location}</small>
                </td>
                <td>
                  {new Date(e.createdAt).toLocaleDateString(
                    l === "fr" ? "fr-CM" : "en-GB",
                  )}
                </td>
                <td>
                  <span className="status">{statusNames[e.status][l]}</span>
                </td>
                <td>
                  <button className="text-link" onClick={() => setSelected(e)}>
                    {t("Consulter", "View")}
                    <Icon name="arrow" size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="empty-state">
        <Icon name={tab === "orders" ? "truck" : "mail"} size={33} />
        <h2>
          {t("Aucune demande dans cette vue", "No enquiries in this view")}
        </h2>
        <p>
          {t(
            "Les demandes reçues depuis le formulaire du site apparaîtront ici. Une demande devient une commande lorsque vous la marquez comme confirmée.",
            "Enquiries received through the website form will appear here. An enquiry becomes an order when you mark it as confirmed.",
          )}
        </p>
        <Link className="text-link" href="/devis" target="_blank">
          {t("Voir le formulaire du site", "View website form")}
          <Icon name="diagonal" size={16} />
        </Link>
      </div>
    );
  }
  return (
    <main id="main" className="admin-layout">
      <aside className="admin-sidebar">
        <Brand light />
        <span className="admin-label">
          {t("VOTRE ESPACE DE GESTION", "YOUR MANAGEMENT SPACE")}
        </span>
        <nav aria-label={t("Administration", "Administration")}>
          {nav.map(([id, icon, label]) => (
            <button
              key={id}
              onClick={() => changeTab(id)}
              aria-pressed={tab === id}
            >
              <Icon name={icon} size={18} />
              {label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <Link href="/" target="_blank">
            <Icon name="diagonal" size={17} />
            {t("Voir le site", "View website")}
          </Link>
          <button onClick={logout}>
            <Icon name="logout" size={17} />
            {t("Déconnexion", "Sign out")}
          </button>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <span>
            Animal Nutrition Cameroon{" "}
            <span style={{ color: "var(--muted)" }}>
              / {t("Administration", "Administration")}
            </span>
          </span>
          <div>
            <button
              className="admin-language"
              onClick={() => {
                document.cookie = `anc_locale=${l === "fr" ? "en" : "fr"};path=/;max-age=31536000;SameSite=Lax`;
                router.refresh();
              }}
            >
              {l === "fr" ? "EN" : "FR"}
            </button>
            <button
              className="icon-button"
              aria-label={t("Changer de thème", "Change theme")}
              onClick={() => {
                const next =
                  document.documentElement.dataset.theme === "dark"
                    ? "light"
                    : "dark";
                document.documentElement.dataset.theme = next;
                document.cookie = `anc_theme=${next};path=/;max-age=31536000;SameSite=Lax`;
              }}
            >
              <Icon name="sun" size={18} />
            </button>
            <button
              className="icon-button"
              aria-label={t("Déconnexion", "Sign out")}
              onClick={logout}
            >
              <Icon name="logout" size={17} />
            </button>
            <span className="admin-avatar">AN</span>
          </div>
        </header>
        <div className="admin-content">
          <div className="admin-title">
            <div>
              <span className="eyebrow" style={{ marginBottom: 9 }}>
                {t("ESPACE DE GESTION", "BUSINESS DASHBOARD")}
              </span>
              <h1>{nav.find((n) => n[0] === tab)?.[2]}</h1>
              <p>
                {t(
                  "Gérez votre catalogue et le suivi de vos clients.",
                  "Manage your catalogue and follow up with your customers.",
                )}
              </p>
            </div>
            <Link className="button button-outline" href="/" target="_blank">
              {t("Prévisualiser le site", "Preview website")}
              <Icon name="diagonal" size={17} />
            </Link>
          </div>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          {notice && (
            <p className="admin-toast" role="status">
              {notice}
            </p>
          )}
          {tab === "overview" && (
            <>
              <div className="admin-stats">
                {[
                  [
                    t("Produits au catalogue", "Catalogue products"),
                    products.filter((p) => p.available).length,
                    "box",
                    t("Visibles sur le site", "Visible on the website"),
                  ],
                  [
                    t("Nouvelles demandes", "New enquiries"),
                    enquiries.filter((e) => e.status === "new").length,
                    "mail",
                    t("À prendre en charge", "Awaiting follow-up"),
                  ],
                  [
                    t("Commandes confirmées", "Confirmed orders"),
                    enquiries.filter((e) => e.status === "confirmed").length,
                    "truck",
                    t("En préparation / livraison", "Preparing / delivering"),
                  ],
                  [
                    t("Contacts enregistrés", "Saved contacts"),
                    customers.length,
                    "users",
                    t("Issus des demandes reçues", "From received enquiries"),
                  ],
                ].map(([title, value, icon, note]) => (
                  <div className="stat-card" key={title}>
                    <span>
                      {title}
                      <Icon name={String(icon)} size={19} />
                    </span>
                    <strong>{value}</strong>
                    <small>{note}</small>
                  </div>
                ))}
              </div>
              <div className="admin-panel">
                <div className="admin-panel-heading">
                  <div>
                    <h2>{t("Dernières demandes", "Recent enquiries")}</h2>
                    <p>
                      {t(
                        "Les informations reçues depuis votre site",
                        "Information received through your website",
                      )}
                    </p>
                  </div>
                  <button
                    className="text-link"
                    onClick={() => changeTab("enquiries")}
                  >
                    {t("Tout consulter", "View all")}
                    <Icon name="arrow" size={16} />
                  </button>
                </div>
                {renderTable(enquiries.slice(0, 5))}
              </div>
              <div className="admin-two-columns">
                <div className="admin-panel">
                  <div className="admin-panel-heading">
                    <h2>{t("Votre catalogue", "Your catalogue")}</h2>
                    <button
                      className="text-link"
                      onClick={() => changeTab("products")}
                    >
                      {t("Gérer", "Manage")}
                      <Icon name="arrow" size={16} />
                    </button>
                  </div>
                  <div className="admin-table-wrap">
                    <table>
                      <tbody>
                        {categories.map((c) => (
                          <tr key={c.id}>
                            <td>
                              <div className="admin-product-name">
                                <span className="admin-product-thumbnail">
                                  <Image
                                    src={c.image}
                                    alt=""
                                    fill
                                    sizes="44px"
                                  />
                                </span>
                                <strong>{c.name[l]}</strong>
                              </div>
                            </td>
                            <td>
                              {
                                products.filter(
                                  (p) => p.category === c.id && p.available,
                                ).length
                              }{" "}
                              {t("produits", "products")}
                            </td>
                            <td>
                              <Link
                                className="text-link"
                                target="_blank"
                                href={`/${c.id}`}
                              >
                                <Icon name="diagonal" size={17} />
                                <span className="sr-only">
                                  {t("Voir", "View")} {c.name[l]}
                                </span>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="admin-panel">
                  <div className="admin-panel-heading">
                    <h2>
                      {t("Préparation du lancement", "Launch preparation")}
                    </h2>
                  </div>
                  <LaunchChecklist domain={domain} />
                </div>
              </div>
            </>
          )}
          {(tab === "enquiries" || tab === "orders") && (
            <div className="admin-panel">
              <div className="admin-panel-heading">
                <div className="admin-filters">
                  <label className="search-field">
                    <Icon name="search" size={17} />
                    <input
                      aria-label={t(
                        "Rechercher les demandes",
                        "Search enquiries",
                      )}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t(
                        "Nom, téléphone, référence…",
                        "Name, phone, reference…",
                      )}
                    />
                  </label>
                  <select
                    aria-label={t("Filtrer par statut", "Filter by status")}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">
                      {t("Tous les statuts", "All statuses")}
                    </option>
                    {(tab === "orders"
                      ? (["confirmed", "delivered"] as const)
                      : statuses
                    ).map((s) => (
                      <option key={s} value={s}>
                        {statusNames[s][l]}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={exportCSV}
                  className="text-link"
                  disabled={!rows.length}
                >
                  <Icon name="download" size={17} />
                  CSV
                </button>
              </div>
              {renderTable(rows)}
            </div>
          )}
          {tab === "products" && (
            <>
              <p className="admin-notice">
                {t(
                  "Modifiez les textes en français et en anglais. Le bouton d’aperçu ouvre la fiche publique. Masquer un produit le retire du catalogue sans supprimer son historique.",
                  "Edit French and English copy. Preview opens the public product page. Hiding a product removes it from the catalogue while preserving its history.",
                )}
              </p>
              <div className="admin-products-grid">
                {products.map((p) => (
                  <ProductEditor
                    key={p.id + JSON.stringify(p)}
                    product={p}
                    busy={busy}
                    onSave={update}
                  />
                ))}
              </div>
            </>
          )}
          {tab === "customers" && (
            <div className="admin-panel">
              <div className="admin-panel-heading">
                <h2>{t("Contacts des demandes", "Enquiry contacts")}</h2>
                <span className="status">{customers.length}</span>
              </div>
              {customers.length ? (
                <div className="admin-table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>{t("Nom", "Name")}</th>
                        <th>{t("Téléphone", "Phone")}</th>
                        <th>{t("Localité", "Location")}</th>
                        <th>{t("Demandes", "Enquiries")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((c) => (
                        <tr key={c.phone}>
                          <td>{c.name}</td>
                          <td>
                            <a href={`tel:${c.phone.replace(/[^+\d]/g, "")}`}>
                              {c.phone}
                            </a>
                          </td>
                          <td>{c.location}</td>
                          <td>
                            {
                              enquiries.filter(
                                (e) =>
                                  e.phone.replace(/\D/g, "") ===
                                  c.phone.replace(/\D/g, ""),
                              ).length
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <Icon name="users" size={33} />
                  <h2>
                    {t("Aucun contact pour le moment", "No contacts yet")}
                  </h2>
                  <p>
                    {t(
                      "Les contacts sont créés à partir des demandes reçues.",
                      "Contacts are created from received enquiries.",
                    )}
                  </p>
                </div>
              )}
            </div>
          )}
          {tab === "settings" && (
            <>
              <div className="admin-panel">
                <div className="admin-panel-heading">
                  <h2>{t("État du lancement", "Launch status")}</h2>
                  <span className="status">
                    {t("Non publié", "Unpublished")}
                  </span>
                </div>
                <LaunchChecklist domain={domain} />
              </div>
              <div className="admin-panel">
                <div className="admin-panel-heading">
                  <h2>
                    {t("Informations de l’entreprise", "Business information")}
                  </h2>
                </div>
                <div className="admin-settings">
                  <div>
                    <h3>Animal Nutrition Cameroon LLC</h3>
                    <p>
                      {t(
                        "Derrière le Commissariat d’Odza, Yaoundé, Cameroun",
                        "Behind Odza Police Station, Yaoundé, Cameroon",
                      )}
                    </p>
                    <p>
                      WhatsApp: +237 659 199 943 · {t("Téléphone", "Phone")}:
                      +237 655 61 61 09
                    </p>
                    <a href="mailto:info@anc.cm">info@anc.cm</a>
                  </div>
                  <div>
                    <h3>{t("Données et accès", "Data and access")}</h3>
                    <p>
                      {t(
                        "Les demandes et le catalogue sont enregistrés sur le serveur. L’accès administrateur est protégé par une session de huit heures. La modification des identifiants et la sauvegarde des données se font dans la configuration du serveur.",
                        "Enquiries and catalogue changes are saved on the server. Administrator access uses an eight-hour session. Credentials and data backups are managed in the server configuration.",
                      )}
                    </p>
                  </div>
                  <div>
                    <h3>{t("Pages légales", "Legal pages")}</h3>
                    <p>
                      <Link href="/confidentialite" target="_blank">
                        {t("Politique de confidentialité", "Privacy policy")}
                      </Link>{" "}
                      ·{" "}
                      <Link href="/conditions" target="_blank">
                        {t("Conditions générales", "Terms & conditions")}
                      </Link>
                    </p>
                    <p>
                      {t(
                        "Validez les durées de conservation, les conditions commerciales et les informations légales avec le responsable de l’entreprise avant publication.",
                        "Confirm retention periods, trading terms and legal information with the business owner before publication.",
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {selected && (
        <dialog
          ref={dialog}
          className="enquiry-dialog"
          onCancel={() => setSelected(null)}
          onClose={() => setSelected(null)}
          aria-labelledby="enquiry-title"
        >
          <div className="dialog-heading">
            <div>
              <h2 id="enquiry-title">{selected.name}</h2>
              <p>{selected.id}</p>
            </div>
            <button
              className="icon-button"
              aria-label={t("Fermer", "Close")}
              onClick={() => setSelected(null)}
            >
              <Icon name="close" />
            </button>
          </div>
          <dl className="product-specs">
            {[
              [t("Téléphone", "Phone"), selected.phone],
              [t("Localité", "Location"), selected.location],
              [
                t("Produit", "Product"),
                products.find((p) => p.id === selected.product)?.name[l] ||
                  selected.category,
              ],
              [
                t("Quantité / effectif", "Quantity / count"),
                selected.quantity || t("Non précisé", "Not specified"),
              ],
            ].map(([a, b]) => (
              <div key={a}>
                <dt>{a}</dt>
                <dd>{b}</dd>
              </div>
            ))}
          </dl>
          <p>{selected.message}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const status = new FormData(e.currentTarget).get("status");
              update({ type: "enquiry", id: selected.id, status });
            }}
          >
            <label>
              {t("État de la demande", "Enquiry status")}
              <select name="status" defaultValue={selected.status}>
                {statuses.map((s) => (
                  <option value={s} key={s}>
                    {statusNames[s][l]}
                  </option>
                ))}
              </select>
            </label>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <div className="button-row" style={{ marginTop: 20 }}>
              <button
                className="button button-green"
                type="submit"
                disabled={busy}
              >
                {busy
                  ? t("Enregistrement…", "Saving…")
                  : t("Enregistrer le statut", "Save status")}
              </button>
              <a
                className="button button-outline"
                href={`tel:${selected.phone.replace(/[^+\d]/g, "")}`}
              >
                <Icon name="phone" size={17} />
                {t("Appeler", "Call")}
              </a>
            </div>
          </form>
        </dialog>
      )}
    </main>
  );
}
function ProductEditor({
  product: p,
  busy,
  onSave,
}: {
  product: Product;
  busy: boolean;
  onSave: (data: object) => void;
}) {
  const l = useLocale();
  return (
    <form
      className="admin-product-editor"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        onSave({
          type: "product",
          id: p.id,
          name: { fr: data.get("name_fr"), en: data.get("name_en") },
          description: {
            fr: data.get("description_fr"),
            en: data.get("description_en"),
          },
          available: data.get("available") === "on",
        });
      }}
    >
      <div className="eyebrow">
        {categories.find((c) => c.id === p.category)?.name[l]}
      </div>
      <h2>{p.name[l]}</h2>
      <div className="form-grid">
        <label>
          Nom (FR)
          <input
            name="name_fr"
            defaultValue={p.name.fr}
            required
            minLength={3}
            maxLength={150}
          />
        </label>
        <label>
          Name (EN)
          <input
            name="name_en"
            defaultValue={p.name.en}
            required
            minLength={3}
            maxLength={150}
          />
        </label>
        <label className="form-full">
          Description (FR)
          <textarea
            name="description_fr"
            defaultValue={p.description.fr}
            required
            minLength={3}
            maxLength={1500}
            rows={3}
          />
        </label>
        <label className="form-full">
          Description (EN)
          <textarea
            name="description_en"
            defaultValue={p.description.en}
            required
            minLength={3}
            maxLength={1500}
            rows={3}
          />
        </label>
      </div>
      <label className="consent">
        <input type="checkbox" name="available" defaultChecked={p.available} />
        {l === "fr" ? "Visible dans le catalogue" : "Visible in catalogue"}
      </label>
      <div className="button-row">
        <button type="submit" className="button button-green" disabled={busy}>
          {l === "fr" ? "Enregistrer" : "Save changes"}
          <Icon name="check" size={17} />
        </button>
        {p.available && (
          <Link
            href={`/produits/${p.id}`}
            target="_blank"
            className="button button-outline"
          >
            {l === "fr" ? "Aperçu" : "Preview"}
            <Icon name="diagonal" size={17} />
          </Link>
        )}
      </div>
    </form>
  );
}
function LaunchChecklist({ domain }: { domain: string | null }) {
  const l = useLocale(),
    t = (fr: string, en: string) => (l === "fr" ? fr : en);
  return (
    <div className="admin-checklist">
      {[
        [
          true,
          t("Favicon personnalisé", "Custom favicon"),
          t(
            "Icône ANC et icône mobile ajoutées",
            "ANC browser and mobile icons added",
          ),
        ],
        [
          true,
          t(
            "Français, anglais et deux thèmes",
            "French, English and two themes",
          ),
          t(
            "Préférences conservées entre les visites",
            "Preferences persist between visits",
          ),
        ],
        [
          true,
          t(
            "Pages légales et aucun tag de créateur",
            "Legal pages and no builder badge",
          ),
          t(
            "Confidentialité et conditions disponibles pour validation",
            "Privacy and terms available for review",
          ),
        ],
        [
          false,
          t("Domaine personnalisé et HTTPS", "Custom domain and HTTPS"),
          domain
            ? `${domain} · ${t("configuration à vérifier avant publication", "configuration must be verified before launch")}`
            : t(
                "Domaine non connecté. Publication en attente.",
                "Domain not connected. Publication pending.",
              ),
        ],
        [
          false,
          t("Validation avant mise en ligne", "Pre-launch approval"),
          t(
            "Conditions commerciales, conservation des données et hébergement à confirmer",
            "Confirm trading terms, data retention and hosting",
          ),
        ],
      ].map(([done, title, note]) => (
        <div key={String(title)}>
          <span className={done ? "" : "pending"}>
            <Icon name={done ? "check" : "settings"} size={19} />
          </span>
          <span>
            {title}
            <p>{note}</p>
          </span>
        </div>
      ))}
    </div>
  );
}
