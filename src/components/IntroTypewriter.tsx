"use client";

import { useEffect, useState } from "react";
import styles from "./IntroTypewriter.module.css";

const MESSAGE =
  "Andrew is a product design leader working in new technology and media.";

const CHAR_MS = 28;
const START_DELAY_MS = 400;

export function IntroTypewriter() {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setText(MESSAGE);
      setDone(true);
      return;
    }

    let index = 0;
    let intervalId: number | undefined;
    const startId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        index += 1;
        setText(MESSAGE.slice(0, index));
        if (index >= MESSAGE.length) {
          window.clearInterval(intervalId);
          setDone(true);
        }
      }, CHAR_MS);
    }, START_DELAY_MS);

    return () => {
      window.clearTimeout(startId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, []);

  return (
    <p className={styles.intro} aria-live="polite">
      <span>{text}</span>
      <span
        className={`${styles.caret} ${done ? styles.caretIdle : ""}`}
        aria-hidden="true"
      />
    </p>
  );
}
