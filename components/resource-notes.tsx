"use client";
import { useLocale } from "./ui";
export function ResourceNotes() {
  const l = useLocale();
  const notes =
    l === "fr"
      ? [
          [
            "01 · AQUACULTURE",
            "Avant de changer de format",
            "Notez le poids moyen de vos poissons et le format actuellement utilisé. Ces deux repères aideront notre équipe à vous orienter dans la gamme tilapia ou poisson-chat.",
          ],
          [
            "02 · VOLAILLE",
            "Aliment ou concentré ?",
            "Vérifiez la désignation du produit. Pour un concentré, demandez la formule de mélange et le taux d’incorporation propres à la référence avant utilisation.",
          ],
          [
            "03 · ÉLEVAGE PORCIN",
            "Précisez la phase d’élevage",
            "Porcelets, truies gestantes et truies allaitantes correspondent à des besoins distincts. Précisez l’âge, le poids et la phase de reproduction dans votre demande.",
          ],
        ]
      : [
          [
            "01 · AQUACULTURE",
            "Before changing pellet size",
            "Note your fish’s average weight and current feed format. These two details help our team guide you through the tilapia or catfish range.",
          ],
          [
            "02 · POULTRY",
            "Complete feed or concentrate?",
            "Check the product designation. For a concentrate, request the mixing formula and inclusion rate for the exact product before use.",
          ],
          [
            "03 · PIG FARMING",
            "Specify the production stage",
            "Piglets, gestating sows and lactating sows have different needs. Include age, weight and reproductive stage in your enquiry.",
          ],
        ];
  return (
    <section className="resources-quick-notes">
      <span className="eyebrow">
        {l === "fr" ? "LES REPÈRES DE L’ÉQUIPE" : "NOTES FROM OUR TEAM"}
      </span>
      <h2>
        {l === "fr"
          ? "Trois conseils avant de commander."
          : "Three things to check before ordering."}
      </h2>
      <div className="resources-note-grid">
        {notes.map(([n, title, body]) => (
          <article key={n}>
            <span>{n}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
