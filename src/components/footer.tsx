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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6 pt-10 sm:pt-12">
        <div className="xl:grid xl:grid-cols-2 xl:gap-8">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex justify-center sm:justify-start">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden bg-white flex items-center justify-center">
                <Image
                  src={LogoPhase1}
                  alt="Path Xpress AI Logo"
                  width={52}
                  height={52}
                  className="object-contain sm:w-[68px] sm:h-[68px]"
                  priority
                />
              </div>
            </div>
          </div>
          <div className="mt-8 sm:mt-0">
            <h3 className="text-sm font-semibold leading-6 text-white text-center sm:text-left">
              {t("footer.title")}
            </h3>
            <ul role="list" className="mt-4 space-y-2 sm:space-y-3 flex flex-col items-center sm:items-start">
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
        <div className="mt-6 border-t border-gray-700 pt-6 flex flex-col items-center sm:flex-row sm:justify-between sm:items-center">
          <p className="text-xs leading-5 text-gray-400 text-center sm:text-left order-2 sm:order-1 mt-4 sm:mt-0">
            &copy; {new Date().getFullYear()} {t("footer.copyright")}
          </p>
          <div className="flex items-center order-1 sm:order-2">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
