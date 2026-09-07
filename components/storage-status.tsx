"use client";
import { useLocale } from "./ui";
export function StorageStatus({ ready }: { ready: boolean }) {
  const l = useLocale();
  if (ready) return null;
  return (
    <div className="storage-warning" role="status">
      <h2>
        {l === "fr" ? "Connectez la base de données" : "Connect the database"}
      </h2>
      <p>
        {l === "fr"
          ? "La connexion administrateur fonctionne, mais l’enregistrement des demandes et des modifications nécessite la base distante. Ajoutez TURSO_DATABASE_URL et TURSO_AUTH_TOKEN dans les paramètres Vercel, puis redéployez."
          : "Administrator sign-in is working, but saving enquiries and changes requires the remote database. Add TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in Vercel settings, then redeploy."}
      </p>
    </div>
  );
}
