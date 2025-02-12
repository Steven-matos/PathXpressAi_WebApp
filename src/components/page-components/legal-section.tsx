"use client";

import { cn } from "@/lib/utils";
import { useTranslation } from "@/context/TranslationContext";

interface LegalContent {
  title: string;
  content: string[];
}

interface LegalSectionProps {
  content: string;
}

interface Section {
  title: string;
  content: string;
  subcontent?: string[];
}

export function LegalSection({ content }: LegalSectionProps) {
  const { t } = useTranslation();
  const sections = (t(`${content}.sections`) as unknown as Section[]) || [];

  return (
    <div className="space-y-8">
      {Array.isArray(sections) &&
        sections.map((section: Section, index: number) => (
          <section key={index} className="space-y-4">
            <h2
              className={cn("text-xl font-semibold", index > 0 ? "mt-8" : "")}
            >
              {section.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {section.content}
            </p>
            {section.subcontent && (
              <div className="space-y-2 pl-4">
                {section.subcontent.map((item: string, itemIndex: number) => {
                  const isNumbered = /^\d+\)/.test(item);
                  return (
                    <p
                      key={itemIndex}
                      className={isNumbered ? "font-medium" : "pl-4"}
                    >
                      {isNumbered ? (
                        <span className="font-semibold">
                          {item.match(/^\d+\)/)?.[0]}
                        </span>
                      ) : null}
                      {item.replace(/^\d+\)\s*/, "")}
                    </p>
                  );
                })}
              </div>
            )}
          </section>
        ))}
    </div>
  );
}
