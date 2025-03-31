"use client";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { LegalContent } from "@/features/legal-content/LegalContent";
import { privacyPolicy } from "@/content/policies";

export default function Page() {
  return (
    <>
      <Header />
      <LegalContent 
        content={privacyPolicy}
        title="Privacy Policy"
      />
      <Footer />
    </>
  );
}
