"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="container empty-state">
      <h1>Une erreur est survenue. / Something went wrong.</h1>
      <button className="button button-green" onClick={reset}>
        Réessayer / Try again
      </button>
    </main>
  );
}
