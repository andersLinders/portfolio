import Image from "next/image";
import type { PortfolioSection } from "@/data/projects";
import styles from "./ProjectSection.module.css";

type ProjectSectionProps = {
  section: PortfolioSection;
  priority?: boolean;
  activeFilters: string[];
  onToggleTag: (tag: string) => void;
};

export function ProjectSection({
  section,
  priority = false,
  activeFilters,
  onToggleTag,
}: ProjectSectionProps) {
  const showCompany = Boolean(section.company) && section.company !== section.title;

  return (
    <section className={styles.section} aria-labelledby={`${section.key}-title`}>
      <div className={styles.copy}>
        <div className={styles.heading}>
          {showCompany ? (
            <p className={styles.company}>{section.company}</p>
          ) : null}
          <h2 id={`${section.key}-title`} className={styles.title}>
            {section.title}
          </h2>
        </div>

        <div className={styles.body}>
          <p className={styles.blurb}>{section.blurb}</p>

          {section.tags.length > 0 ? (
            <ul className={styles.tags} aria-label="Filter by platform">
              {section.tags.map((tag) => {
                const selected = activeFilters.includes(tag);
                return (
                  <li key={tag}>
                    <button
                      type="button"
                      className={`${styles.tag} ${selected ? styles.tagSelected : ""}`}
                      aria-pressed={selected}
                      onClick={() => onToggleTag(tag)}
                    >
                      {tag}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </div>

      <div className={styles.media}>
        <Image
          src={section.image}
          alt=""
          fill
          sizes="(max-width: 720px) 100vw, 70vw"
          className={styles.image}
          style={{ objectPosition: section.imagePosition }}
          priority={priority}
        />
      </div>
    </section>
  );
}
