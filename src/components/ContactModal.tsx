"use client";

import { Inter } from "next/font/google";
import { useEffect, useId, useRef } from "react";
import { FigmaGlassPanel } from "@/components/FigmaGlassPanel";
import { CONTACT_MODAL_GLASS } from "@/lib/figmaGlass";
import styles from "./ContactModal.module.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const CONTACT_EMAIL = "hello@andrewlindley.com";
/** Set a real E.164 number for the Call button (`tel:`). Empty → mailto fallback. */
export const CONTACT_PHONE = "";

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

  const callHref = CONTACT_PHONE
    ? `tel:${CONTACT_PHONE}`
    : `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Call request")}`;

  return (
    <div className={styles.root} role="presentation">
      {/* Transparent hit target — opaque scrim would block glass backdrop sampling */}
      <button
        type="button"
        className={styles.scrim}
        aria-label="Close dialog"
        onClick={onClose}
      />

      <FigmaGlassPanel
        className={`${styles.dialog} ${inter.className}`}
        effect={CONTACT_MODAL_GLASS}
        fill="rgba(255, 255, 255, 0.2)"
        borderRadius={22}
        style={{ width: 304 }}
      >
        <div
          className={styles.inner}
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/modal-close.svg"
                alt=""
                width={16}
                height={16}
                className={styles.closeIcon}
              />
            </button>
          </div>

          <p className={styles.message}>
            If you would like to learn more about this project or just say hi
            please reach out!
          </p>

          <div className={styles.actions}>
            <a className={styles.callButton} href={callHref}>
              Call
            </a>
            <a
              className={styles.emailButton}
              href={`mailto:${CONTACT_EMAIL}`}
            >
              Email
            </a>
          </div>
        </div>
      </FigmaGlassPanel>
    </div>
  );
}
