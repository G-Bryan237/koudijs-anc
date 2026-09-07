import { authenticated, configured } from "@/lib/auth";
import { readStore } from "@/lib/store";
import { databaseConfigured } from "@/lib/database";
import { AdminLogin, Dashboard } from "@/components/admin";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};
export default async function AdminPage() {
  if (!(await authenticated())) return <AdminLogin ready={configured()} />;
  const store = await readStore();
  return (
    <Dashboard
      initialProducts={store.products}
      initialEnquiries={store.enquiries}
      domain={process.env.SITE_URL || null}
      storageReady={databaseConfigured()}
    />
  );
}
