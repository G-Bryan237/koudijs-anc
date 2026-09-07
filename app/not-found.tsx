import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="container empty-state not-found">
      <span className="eyebrow">404</span>
      <h1>
        Cette page est introuvable.
        <br />
        This page could not be found.
      </h1>
      <Link className="button button-green" href="/">
        Accueil / Home
      </Link>
    </main>
  );
}
