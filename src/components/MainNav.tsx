"use client";

import { projects, type ProjectId } from "@/data/projects";
import styles from "./MainNav.module.css";

type MainNavProps = {
  activeId: ProjectId;
  expandedId: ProjectId | null;
  activeSubId: string | null;
  onActivateProject: (id: ProjectId) => void;
  onActivateSub: (projectId: ProjectId, subId: string) => void;
  onCollapse: () => void;
  onOpenContact: () => void;
};

export function MainNav({
  activeId,
  expandedId,
  activeSubId,
  onActivateProject,
  onActivateSub,
  onCollapse,
  onOpenContact,
}: MainNavProps) {
  return (
    <nav
      className={styles.nav}
      aria-label="Work"
      onMouseLeave={onCollapse}
    >
      {projects.map((project) => {
        const isActive = activeId === project.id;
        const isExpanded = expandedId === project.id;
        const hasSubs = project.subItems.length > 0;

        return (
          <div
            key={project.id}
            className={`${styles.item} ${isActive ? styles.itemActive : ""} ${
              isExpanded ? styles.itemExpanded : ""
            }`}
            onMouseEnter={() => onActivateProject(project.id)}
            onFocusCapture={() => onActivateProject(project.id)}
          >
            <button
              type="button"
              className={styles.trigger}
              aria-expanded={hasSubs ? isExpanded : undefined}
              aria-controls={hasSubs ? `subs-${project.id}` : undefined}
              onClick={() => {
                onActivateProject(project.id);
                onOpenContact();
              }}
            >
              {project.label}
            </button>

            {hasSubs ? (
              <div
                id={`subs-${project.id}`}
                className={styles.subs}
                aria-hidden={!isExpanded}
              >
                {project.subItems.map((sub) => {
                  const isSubActive = isExpanded && activeSubId === sub.id;

                  return (
                    <button
                      key={sub.id}
                      type="button"
                      className={`${styles.subLink} ${
                        isSubActive ? styles.subLinkActive : ""
                      }`}
                      onMouseEnter={() => onActivateSub(project.id, sub.id)}
                      onFocus={() => onActivateSub(project.id, sub.id)}
                      onClick={() => {
                        onActivateSub(project.id, sub.id);
                        onOpenContact();
                      }}
                    >
                      {sub.label}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
