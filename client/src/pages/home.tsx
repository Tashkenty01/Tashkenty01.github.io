import Header from "@/components/header";
import RegistrationSection from "@/components/registration-section";
import UploadSection from "@/components/upload-section";
import CatalogSection from "@/components/catalog-section";
import AdminDashboard from "@/components/admin-dashboard";
import CategoriesSection from "@/components/categories-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <RegistrationSection />
        <UploadSection />
        <CatalogSection />
        <AdminDashboard />
        <CategoriesSection />
      </main>
      <Footer />
    </div>
  );
}
