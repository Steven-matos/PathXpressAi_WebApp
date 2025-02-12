"use client";

import Link from "next/link";
import { useTranslation } from "@/context/TranslationContext";
import { LanguageSwitcher } from "./language-switcher";
import Image from "next/image";
import LogoPhase1 from "../../public/logo_phase1.png";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const { t } = useTranslation();

  const navigation = {
    company: [
      { name: t("footer.termsAndConditions"), href: "/terms-and-conditions" },
      { name: t("footer.privacyPolicy"), href: "/privacy-policy" },
    ],
  };

  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8">
        <div className="xl:grid xl:grid-cols-2 xl:gap-8">
          <div className="space-y-8">
            <div className="flex items-center">
              <div className="h-20 w-20 rounded-full overflow-hidden bg-white flex items-center justify-center">
                <Image
                  src={LogoPhase1}
                  alt="Path Xpress AI Logo"
                  width={68}
                  height={68}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-6 text-white">
              {t("footer.title")}
            </h3>
            <ul role="list" className="mt-6 space-y-4">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm leading-6 text-gray-300 hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 flex flex-col-reverse sm:flex-row justify-between items-center">
          <p className="mt-8 text-xs leading-5 text-gray-400 sm:mt-0">
            &copy; {new Date().getFullYear()} {t("footer.copyright")}
          </p>
          <div className="flex items-center">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
