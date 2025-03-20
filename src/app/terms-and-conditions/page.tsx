import { TermsAndConditions } from "@/features/legal-content";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function Page() {
  return (
    <>
      <Header />
      <TermsAndConditions />
      <Footer />
    </>
  );
}
