import type { PageContent } from "@/data/projects";
import styles from "./ProjectContentCard.module.css";

type ProjectContentCardProps = {
  content: PageContent;
};

export function ProjectContentCard({ content }: ProjectContentCardProps) {
  return (
    <aside
      className={styles.card}
      aria-label={`${content.title} project details`}
    >
      <div className={styles.inner}>
        <h2 className={styles.title}>{content.title}</h2>
        <p className={styles.role}>{content.role}</p>
        <div className={styles.body}>
          <p className={styles.blurb}>{content.blurb}</p>
          <p className={styles.meta}>
            <span className={styles.metaLabel}>Surfaces:</span>
            <br />
            {content.surfaces}
          </p>
          <p className={styles.meta}>
            <span className={styles.metaLabel}>Skills:</span>
            <br />
            {content.skills}
          </p>
        </div>
      </div>
    </aside>
  );
}
