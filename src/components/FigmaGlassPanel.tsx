"use client";

import {
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  buildGlassFilterMaps,
  SPEC_SAT,
  type FigmaGlassEffect,
} from "@/lib/figmaGlass";
import styles from "./FigmaGlassPanel.module.css";

type FigmaGlassPanelProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  effect: FigmaGlassEffect;
  /** Semi-transparent fill on top of the filtered backdrop (Figma frame fill) */
  fill?: string;
  borderRadius?: number;
};

type Size = {
  width: number;
  height: number;
  borderRadius: number;
};

export function FigmaGlassPanel({
  children,
  className,
  style,
  effect,
  fill = "rgba(255, 255, 255, 0.2)",
  borderRadius = 22,
}: FigmaGlassPanelProps) {
  const rawId = useId();
  const filterId = `figma-glass-${rawId.replace(/:/g, "")}`;
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Size>({
    width: 0,
    height: 0,
    borderRadius,
  });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      const computedRadius =
        parseFloat(getComputedStyle(el).borderRadius) || borderRadius;
      setSize({
        width: Math.max(1, Math.round(width)),
        height: Math.max(1, Math.round(height)),
        borderRadius: Math.round(computedRadius),
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [borderRadius]);

  const maps = useMemo(() => {
    if (size.width === 0 || size.height === 0) return null;
    return buildGlassFilterMaps(
      size.width,
      size.height,
      size.borderRadius,
      effect,
    );
  }, [size.width, size.height, size.borderRadius, effect]);

  const frostCss = `${effect.frost}px`;
  const glassFilter = maps ? `url(#${filterId})` : `blur(${frostCss}) saturate(1.15)`;

  return (
    <>
      <div
        ref={ref}
        className={[styles.panel, className].filter(Boolean).join(" ")}
        style={
          {
            ...style,
            borderRadius,
            "--glass-fill": fill,
            "--glass-frost": frostCss,
            "--glass-filter": glassFilter,
          } as CSSProperties
        }
      >
        <div className={styles.backdrop} aria-hidden />
        <div className={styles.tint} aria-hidden />
        <div className={styles.content}>{children}</div>
      </div>

      {maps ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={0}
          height={0}
          className={styles.svgDefs}
          colorInterpolationFilters="sRGB"
          aria-hidden
        >
          <defs>
            <filter
              id={filterId}
              x="0%"
              y="0%"
              width="100%"
              height="100%"
            >
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation={maps.frost}
                result="blurred_source"
              />
              <feImage
                href={maps.dispUrl}
                x={0}
                y={0}
                width={size.width}
                height={size.height}
                result="disp_map"
                preserveAspectRatio="none"
              />
              {maps.dispersionPct > 0 ? (
                <>
                  <feColorMatrix
                    in="blurred_source"
                    type="matrix"
                    values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                    result="src_r"
                  />
                  <feColorMatrix
                    in="blurred_source"
                    type="matrix"
                    values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                    result="src_g"
                  />
                  <feColorMatrix
                    in="blurred_source"
                    type="matrix"
                    values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                    result="src_b"
                  />
                  <feDisplacementMap
                    in="src_r"
                    in2="disp_map"
                    scale={maps.scale * (1 + (maps.dispersionPct / 100) * 0.15)}
                    xChannelSelector="R"
                    yChannelSelector="G"
                    result="disp_r"
                  />
                  <feDisplacementMap
                    in="src_g"
                    in2="disp_map"
                    scale={maps.scale}
                    xChannelSelector="R"
                    yChannelSelector="G"
                    result="disp_g"
                  />
                  <feDisplacementMap
                    in="src_b"
                    in2="disp_map"
                    scale={maps.scale * (1 - (maps.dispersionPct / 100) * 0.15)}
                    xChannelSelector="R"
                    yChannelSelector="G"
                    result="disp_b"
                  />
                  <feBlend
                    in="disp_r"
                    in2="disp_g"
                    mode="screen"
                    result="disp_rg"
                  />
                  <feBlend
                    in="disp_rg"
                    in2="disp_b"
                    mode="screen"
                    result="displaced"
                  />
                </>
              ) : (
                <feDisplacementMap
                  in="blurred_source"
                  in2="disp_map"
                  scale={maps.scale}
                  xChannelSelector="R"
                  yChannelSelector="G"
                  result="displaced"
                />
              )}
              <feColorMatrix
                in="displaced"
                type="saturate"
                values={String(SPEC_SAT)}
                result="displaced_sat"
              />
              <feImage
                href={maps.specUrl}
                x={0}
                y={0}
                width={size.width}
                height={size.height}
                result="spec_layer"
                preserveAspectRatio="none"
              />
              <feComposite
                in="displaced_sat"
                in2="spec_layer"
                operator="in"
                result="spec_masked"
              />
              <feComponentTransfer in="spec_layer" result="spec_faded">
                <feFuncA type="linear" slope={maps.lightIntensity} />
              </feComponentTransfer>
              <feBlend
                in="spec_masked"
                in2="displaced"
                mode="normal"
                result="with_sat"
              />
              <feBlend in="spec_faded" in2="with_sat" mode="screen" />
            </filter>
          </defs>
        </svg>
      ) : null}
    </>
  );
}
