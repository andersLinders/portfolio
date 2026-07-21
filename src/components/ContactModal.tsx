"use client";

import { useEffect, useId, useRef } from "react";
import styles from "./ContactModal.module.css";

export const CONTACT_EMAIL = "hello@andrewlindley.com";

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ContactModal({ open, onClose }: ContactModalProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.root} role="presentation">
      <button
        type="button"
        className={styles.scrim}
        aria-label="Close dialog"
        onClick={onClose}
      />

      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.header}>
          <p id={titleId} className={styles.greeting}>
            Hi!
          </p>
          <button
            ref={closeRef}
            type="button"
            className={styles.close}
            aria-label="Close"
            onClick={onClose}
          >
            <span className={styles.closeGlyph} aria-hidden="true">
              ×
            </span>
          </button>
        </div>

        <p className={styles.message}>
          If you would like to learn more about these projects or just say hi
          please reach out!
        </p>

        <a className={styles.emailButton} href={`mailto:${CONTACT_EMAIL}`}>
          Email
        </a>
      </div>
    </div>
  );
}
