"use client";

import { useRef, useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useTranslation } from "@/context/TranslationContext";
import { LanguageSwitcher } from "./language-switcher";

export function Header() {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Play video once when component mounts
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  return (
    <Disclosure as="nav" className="bg-white shadow fixed w-full top-0 z-50">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-24 justify-between">
              {/* Logo */}
              <div className="flex flex-shrink-0 items-center">
                <Link href="/" className="flex items-center">
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden bg-white flex items-center justify-center">
                    <video
                      ref={videoRef}
                      className="object-contain h-full w-full"
                      playsInline
                      muted
                    >
                      <source src="/logo-video.mp4" type="video/mp4" />
                    </video>
                  </div>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden sm:flex sm:items-center sm:space-x-4">
                <LanguageSwitcher />
                <Link
                  href="/login"
                  className="rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent transition-colors duration-300"
                >
                  {t("signIn")}
                </Link>
                <Link
                  href="/signup"
                  className="rounded-md bg-accent px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary transition-colors duration-300"
                >
                  {t("signUp")}
                </Link>
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile menu panel */}
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-2 px-4 pb-3 pt-2">
              <div className="flex justify-center pb-2">
                <LanguageSwitcher />
              </div>
              <div className="grid gap-2">
                <Link
                  href="/login"
                  className="w-full rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent transition-colors duration-300 text-center"
                >
                  {t("signIn")}
                </Link>
                <Link
                  href="/signup"
                  className="w-full rounded-md bg-accent px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary transition-colors duration-300 text-center"
                >
                  {t("signUp")}
                </Link>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
