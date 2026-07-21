"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { getBackgroundScenes } from "@/data/projects";
import styles from "./BackgroundStage.module.css";

export type SlideDirection = "left" | "right" | "up" | "down";

type BackgroundStageProps = {
  activeKey: string;
  direction: SlideDirection | null;
};

const scenes = getBackgroundScenes();
const SLIDE_MS = 700;

const enterClass: Record<SlideDirection, string> = {
  right: styles.enterFromRight,
  left: styles.enterFromLeft,
  down: styles.enterFromDown,
  up: styles.enterFromUp,
};

const exitClass: Record<SlideDirection, string> = {
  right: styles.exitToLeft,
  left: styles.exitToRight,
  down: styles.exitToUp,
  up: styles.exitToDown,
};

export function BackgroundStage({ activeKey, direction }: BackgroundStageProps) {
  const visibleKeyRef = useRef(activeKey);
  const [incomingKey, setIncomingKey] = useState(activeKey);
  const [outgoingKey, setOutgoingKey] = useState<string | null>(null);
  const [slideDir, setSlideDir] = useState<SlideDirection | null>(null);

  useEffect(() => {
    if (activeKey === visibleKeyRef.current) return;

    const from = visibleKeyRef.current;
    visibleKeyRef.current = activeKey;

    if (!direction) {
      setIncomingKey(activeKey);
      setOutgoingKey(null);
      setSlideDir(null);
      return;
    }

    setOutgoingKey(from);
    setIncomingKey(activeKey);
    setSlideDir(direction);

    const timeoutId = window.setTimeout(() => {
      setOutgoingKey(null);
      setSlideDir(null);
    }, SLIDE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [activeKey, direction]);

  return (
    <div className={styles.stage} aria-hidden>
      {scenes.map((scene) => {
        const isIncoming = scene.key === incomingKey;
        const isOutgoing = scene.key === outgoingKey;
        const classNames = [styles.layer];

        if (isIncoming && slideDir) {
          classNames.push(styles.layerIncoming, enterClass[slideDir]);
        } else if (isIncoming) {
          classNames.push(styles.layerActive);
        } else if (isOutgoing && slideDir) {
          classNames.push(styles.layerOutgoing, exitClass[slideDir]);
        }

        return (
          <div
            key={scene.key}
            className={classNames.join(" ")}
            style={
              {
                "--image-position": scene.imagePosition,
                "--image-position-mobile": scene.imagePositionMobile,
              } as CSSProperties
            }
          >
            <Image
              className={styles.image}
              src={scene.image}
              alt=""
              fill
              priority={scene.key === "meta"}
              sizes="100vw"
              quality={90}
            />
          </div>
        );
      })}
      <div className={styles.scrim} />
    </div>
  );
}
