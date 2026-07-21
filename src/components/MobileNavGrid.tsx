"use client";

import Image from "next/image";
import { projects } from "@/data/projects";
import styles from "./MobileNavGrid.module.css";

type MobileNavGridProps = {
  onOpenContact: () => void;
};

export function MobileNavGrid({ onOpenContact }: MobileNavGridProps) {
  return (
    <nav className={styles.list} aria-label="Work">
      {projects.map((project) => (
        <section key={project.id} className={styles.group}>
          <button
            type="button"
            className={`${styles.tile} ${styles.mainCard}`}
            onClick={onOpenContact}
          >
            <Image
              className={styles.image}
              src={project.image}
              alt=""
              fill
              sizes="(max-width: 720px) 100vw, 0px"
              quality={85}
              style={{
                objectPosition: project.imagePositionMobile ?? "center center",
              }}
            />
            <span className={styles.scrim} aria-hidden />
            <span className={styles.label}>
              <span className={styles.title}>{project.label}</span>
            </span>
          </button>

          {project.subItems.length > 0 ? (
            <div className={styles.subGrid}>
              {project.subItems.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  className={`${styles.tile} ${styles.subTile}`}
                  onClick={onOpenContact}
                >
                  <Image
                    className={styles.image}
                    src={sub.image}
                    alt=""
                    fill
                    sizes="(max-width: 720px) 50vw, 0px"
                    quality={85}
                    style={{
                      objectPosition:
                        sub.imagePositionMobile ?? "center center",
                    }}
                  />
                  <span className={styles.scrim} aria-hidden />
                  <span className={styles.label}>
                    <span className={styles.company}>{project.label}</span>
                    <span className={styles.title}>{sub.label}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </section>
      ))}
    </nav>
  );
}
