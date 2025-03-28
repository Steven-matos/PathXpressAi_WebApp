import { LegalContent } from "@/features/legal-content/LegalContent";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { termsAndConditions } from "@/content/policies";

export default function Page() {
  return (
    <>
      <Header />
      <LegalContent 
        content={termsAndConditions}
        title="Terms and Conditions"
      />
      <Footer />
    </>
  );
}
