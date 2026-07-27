import { Reveal } from "@/components/motion/Reveal";

type LegalSection = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
  after?: string[];
};

/** Shared layout for /privacy and /terms so the two stay visually identical. */
export function LegalBody({ sections }: { sections: LegalSection[] }) {
  return (
    <div className="space-y-12">
      {sections.map((section, index) => (
        <Reveal key={section.heading} delay={Math.min(index * 0.02, 0.1)}>
          <section>
            <h2 className="mb-4 flex items-baseline gap-4 font-display text-xl font-semibold tracking-[-0.02em] text-ink">
              <span className="font-mono text-[11px] tracking-[0.16em] text-brand">
                {String(index + 1).padStart(2, "0")}
              </span>
              {section.heading}
            </h2>

            <div className="space-y-4 pl-0 sm:pl-[3.25rem]">
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="text-[15px] leading-[1.75] text-muted">
                  {paragraph}
                </p>
              ))}

              {section.list && (
                <ul className="space-y-2.5 py-1">
                  {section.list.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[15px] leading-[1.7] text-muted"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-brand"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {section.after?.map((paragraph) => (
                <p key={paragraph} className="text-[15px] leading-[1.75] text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        </Reveal>
      ))}
    </div>
  );
}
