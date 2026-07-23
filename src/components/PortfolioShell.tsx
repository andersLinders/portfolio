"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ContactModal } from "@/components/ContactModal";
import { IntroTypewriter } from "@/components/IntroTypewriter";
import { ProjectSection } from "@/components/ProjectSection";
import {
  getAllBrands,
  getAllSurfaceTags,
  getPortfolioSections,
} from "@/data/projects";
import { atmosphereGlowsAt } from "@/lib/atmospherePalettes";
import styles from "./PortfolioShell.module.css";

const sections = getPortfolioSections();
const allTags = getAllSurfaceTags();
const allBrands = getAllBrands();

type OpenMenu = "filter" | "brands" | null;

export function PortfolioShell() {
  const [contactOpen, setContactOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [activeBrands, setActiveBrands] = useState<string[]>([]);
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);
  const shellRef = useRef<HTMLDivElement>(null);
  const glowFrame = useRef(0);

  const openContact = useCallback(() => {
    setContactOpen(true);
  }, []);

  const closeContact = useCallback(() => {
    setContactOpen(false);
  }, []);

  const toggleMenu = useCallback((menu: Exclude<OpenMenu, null>) => {
    setOpenMenu((current) => (current === menu ? null : menu));
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setActiveFilters((current) => {
      if (current.includes(tag)) {
        return current.filter((item) => item !== tag);
      }
      return [...current, tag];
    });
    setOpenMenu("filter");
  }, []);

  const toggleBrand = useCallback((brand: string) => {
    setActiveBrands((current) => {
      if (current.includes(brand)) {
        return current.filter((item) => item !== brand);
      }
      return [...current, brand];
    });
    setOpenMenu("brands");
  }, []);

  const clearSurfaceFilters = useCallback(() => {
    setActiveFilters([]);
  }, []);

  const clearBrandFilters = useCallback(() => {
    setActiveBrands([]);
  }, []);

  const clearAllFilters = useCallback(() => {
    setActiveFilters([]);
    setActiveBrands([]);
  }, []);

  useEffect(() => {
    const readScrollY = () =>
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    const applyAtmosphere = (scrollY: number) => {
      const shell = shellRef.current;
      if (!shell) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduced) return;

      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const { a, b } = atmosphereGlowsAt(scrollY / maxScroll);
      shell.style.setProperty("--glow-a", a);
      shell.style.setProperty("--glow-b", b);
    };

    lastScrollY.current = readScrollY();
    applyAtmosphere(lastScrollY.current);

    const onScroll = () => {
      const currentY = readScrollY();
      const delta = currentY - lastScrollY.current;

      if (currentY <= 16) {
        setNavHidden(false);
      } else if (delta > 2) {
        setNavHidden(true);
        setOpenMenu(null);
      } else if (delta < -2) {
        setNavHidden(false);
      }

      lastScrollY.current = currentY;

      if (glowFrame.current) cancelAnimationFrame(glowFrame.current);
      glowFrame.current = requestAnimationFrame(() => {
        applyAtmosphere(currentY);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
      if (glowFrame.current) cancelAnimationFrame(glowFrame.current);
    };
  }, []);

  const visibleSections = useMemo(() => {
    return sections.filter((section) => {
      const matchesSurface =
        activeFilters.length === 0 ||
        activeFilters.some((tag) => section.tags.includes(tag));
      const matchesBrand =
        activeBrands.length === 0 || activeBrands.includes(section.company);
      return matchesSurface && matchesBrand;
    });
  }, [activeFilters, activeBrands]);

  const filtersActive = activeFilters.length > 0;
  const brandsActive = activeBrands.length > 0;

  return (
    <div className={styles.shell} ref={shellRef}>
      <div className={styles.atmosphere} aria-hidden="true" />

      <header
        className={`${styles.header} ${navHidden ? styles.headerHidden : ""}`}
      >
        <Link href="/" className={styles.brand}>
          Andrew Lindley
        </Link>

        <div className={styles.headerMenus}>
          <button
            type="button"
            className={`${styles.navAction} ${openMenu === "brands" || brandsActive ? styles.navActionActive : ""}`}
            onClick={() => toggleMenu("brands")}
            aria-expanded={openMenu === "brands"}
            aria-controls="portfolio-brands"
          >
            Brands
            {brandsActive ? (
              <span className={styles.filterCount}>
                {activeBrands.length}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            className={`${styles.navAction} ${openMenu === "filter" || filtersActive ? styles.navActionActive : ""}`}
            onClick={() => toggleMenu("filter")}
            aria-expanded={openMenu === "filter"}
            aria-controls="portfolio-filters"
          >
            Platforms
            {filtersActive ? (
              <span className={styles.filterCount}>
                {activeFilters.length}
              </span>
            ) : null}
          </button>
        </div>

        <button
          type="button"
          className={`${styles.navAction} ${styles.contact}`}
          onClick={openContact}
        >
          Contact
        </button>

        {openMenu === "brands" ? (
          <div
            id="portfolio-brands"
            className={styles.filterBar}
            role="group"
            aria-label="Filter by brand"
          >
            <ul className={styles.filterTags}>
              {allBrands.map((brand) => {
                const selected = activeBrands.includes(brand);
                return (
                  <li key={brand}>
                    <button
                      type="button"
                      className={`${styles.filterTag} ${selected ? styles.filterTagSelected : ""}`}
                      aria-pressed={selected}
                      onClick={() => toggleBrand(brand)}
                    >
                      {brand}
                    </button>
                  </li>
                );
              })}
            </ul>
            {brandsActive ? (
              <button
                type="button"
                className={styles.clearFilters}
                onClick={clearBrandFilters}
              >
                Clear
              </button>
            ) : null}
          </div>
        ) : null}

        {openMenu === "filter" ? (
          <div
            id="portfolio-filters"
            className={styles.filterBar}
            role="group"
            aria-label="Filter by platform"
          >
            <ul className={styles.filterTags}>
              {allTags.map((tag) => {
                const selected = activeFilters.includes(tag);
                return (
                  <li key={tag}>
                    <button
                      type="button"
                      className={`${styles.filterTag} ${selected ? styles.filterTagSelected : ""}`}
                      aria-pressed={selected}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </button>
                  </li>
                );
              })}
            </ul>
            {filtersActive ? (
              <button
                type="button"
                className={styles.clearFilters}
                onClick={clearSurfaceFilters}
              >
                Clear
              </button>
            ) : null}
          </div>
        ) : null}
      </header>
      <div
        className={`${styles.headerSpacer} ${openMenu ? styles.headerSpacerFiltersOpen : ""}`}
        aria-hidden="true"
      />

      <IntroTypewriter />

      <main className={styles.main}>
        {visibleSections.length > 0 ? (
          visibleSections.map((section, index) => (
            <ProjectSection
              key={section.key}
              section={section}
              priority={index === 0}
              activeFilters={activeFilters}
              onToggleTag={toggleTag}
            />
          ))
        ) : (
          <p className={styles.empty}>
            No projects match these filters.
            <button
              type="button"
              className={styles.emptyClear}
              onClick={clearAllFilters}
            >
              Clear filters
            </button>
          </p>
        )}
      </main>

      <ContactModal open={contactOpen} onClose={closeContact} />
    </div>
  );
}
