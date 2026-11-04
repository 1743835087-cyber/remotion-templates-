import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

// ==========================================
// 1. Math & Easing Formulas
// ==========================================

const E = {
  linear: (t: number) => t,
  outQuint: (t: number) => 1 - Math.pow(1 - t, 5),
  outBack: (t: number, s = 1.70158) =>
    1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2),
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const seg = (
  t: number,
  t0: number,
  t1: number,
  ease: (x: number) => number = E.linear
) => ease(Math.min(1, Math.max(0, (t - t0) / (t1 - t0))));

const mixHex = (a: string, b: string, k: number) => {
  k = clamp01(k);
  const cleanA = a.replace('#', '');
  const cleanB = b.replace('#', '');
  const pa = [0, 2, 4].map((i) => parseInt(cleanA.slice(i, i + 2), 16));
  const pb = [0, 2, 4].map((i) => parseInt(cleanB.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * k));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};

// ==========================================
// 2. Component Props & Configuration
// ==========================================

export interface KineticEditorialRollProps {
  theme?: 'dark' | 'light';
  stem?: string;
  stemSub?: string;
  words?: string[];
  accentColor?: string;
}

const DEFAULT_WORDS = ['SUBSTANCE', 'PRECISION', 'RESTRAINT', 'PURE CRAFT'];

export const KineticEditorialRoll: React.FC<KineticEditorialRollProps> = ({
  theme = 'dark',
  stem = 'MADE FOR THOSE WHO VALUE',
  stemSub = '致敬克制 · 拒绝千篇一律的 AI 模板',
  words = DEFAULT_WORDS,
  accentColor = '#FF4800', // Dieter Rams / Teenage Engineering Architectural Vermilion
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = Math.min(1, frame / Math.max(1, durationInFrames - 1));

  const isDark = theme === 'dark';
  const inkColor = isDark ? '#F5F5F2' : '#111215';
  const mutedColor = isDark ? '#484C56' : '#9E9FA5';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)';
  const labelColor = isDark ? '#7E8494' : '#6A6D75';

  const ROW = 58;

  // 3 transitions timed with 103 BPM (~17.5f per beat)
  // Total duration: 240 frames
  // Step 1: starts f=60, ends f=78 (~18 frames) -> settles at f=78
  // Step 2: starts f=115, ends f=133 (~18 frames) -> settles at f=133
  // Step 3: starts f=165, ends f=183 (~18 frames) -> settles at f=183
  // Final hold: f=183 to 240 (57 frames = 1.9 seconds of confident breathing!)
  const STEPS = [60 / 240, 115 / 240, 165 / 240];
  const STEP_LEN = 18 / 240;

  const reelAt = (timeVal: number) => {
    let p = 0;
    for (const s of STEPS) {
      const u = seg(timeVal, s, s + STEP_LEN);
      p += 0.7 * E.outQuint(u) + 0.3 * E.outBack(u);
    }
    return p;
  };

  const p = reelAt(t);

  // Speed-based vertical motion blur
  const DT = 0.5 / (durationInFrames - 1);
  const speed = Math.abs(reelAt(t + DT) - reelAt(t - DT));
  const motionBlur = Math.min(5, speed * ROW * 0.25);

  // Elegant entrance fade & subtle slide
  const enterProgress = seg(t, 0.02, 0.15, E.outQuint);

  // Subtle exit fade at the very end
  const exitOpacity = 1 - seg(t, 0.94, 0.99);

  // Current active word index for the indicator
  const activeWordIdx = Math.min(words.length - 1, Math.round(p));

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: enterProgress * exitOpacity,
        transform: `translateY(${(1 - enterProgress) * 20}px)`,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Alibaba PuHuiTi", "Helvetica Neue", Inter, sans-serif',
      }}
    >
      {/* Swiss Editorial Container */}
      <div
        style={{
          width: 980,
          border: `1px solid ${borderColor}`,
          borderRadius: 2,
          padding: '48px 56px',
          background: isDark ? 'rgba(16, 17, 21, 0.6)' : 'rgba(255, 255, 255, 0.8)',
          boxShadow: isDark
            ? '0 30px 80px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
            : '0 20px 60px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        }}
      >
        {/* Top Swiss Editorial Header Line */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            borderBottom: `1px solid ${borderColor}`,
            paddingBottom: 16,
            marginBottom: 36,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: accentColor,
                display: 'inline-block',
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 3,
                color: labelColor,
                textTransform: 'uppercase',
              }}
            >
              EDITORIAL TYPOGRAPHY // 01
            </span>
          </div>

          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: 2,
              color: labelColor,
            }}
          >
            INDEX: 0{activeWordIdx + 1} / 0{words.length}
          </div>
        </div>

        {/* Core Kinetic Sentence Area */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 28,
          }}
        >
          {/* Fixed Sentence Stem */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div
              style={{
                fontSize: 48,
                fontWeight: 800,
                color: inkColor,
                letterSpacing: -1.2,
                lineHeight: 1.1,
                whiteSpace: 'nowrap',
              }}
            >
              {stem}
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: labelColor,
                letterSpacing: 0.5,
              }}
            >
              {stemSub}
            </div>
          </div>

          {/* Elegant Vertical Divider Rule */}
          <div
            style={{
              width: 1,
              height: ROW * 2,
              background: borderColor,
            }}
          />

          {/* 3-Row Viewport Window with Mask */}
          <div
            style={{
              position: 'relative',
              height: ROW * 3,
              width: 380,
              overflow: 'hidden',
              WebkitMaskImage:
                'linear-gradient(180deg, transparent 0%, #000 24%, #000 76%, transparent 100%)',
              maskImage:
                'linear-gradient(180deg, transparent 0%, #000 24%, #000 76%, transparent 100%)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                transform: `translateY(${ROW - p * ROW}px)`,
              }}
            >
              {words.map((w, i) => {
                const d = Math.abs(i - p);
                // Vertical-only Gaussian blur + subtle motion blur
                const blur =
                  (d < 1 ? 3.2 * d : 3.2 + 2 * Math.min(d - 1, 1)) +
                  motionBlur;
                const op =
                  d < 1
                    ? 1 - 0.7 * d
                    : Math.max(0.12, 0.3 - 0.18 * (d - 1));

                // Architectural cylinder squash (subtle perspective)
                const squash = 1 - 0.12 * Math.min(1, d / 1.4);
                const filterId = `editorial-vroll-${i}`;

                return (
                  <div
                    key={`${w}-${i}`}
                    style={{ position: 'relative', height: ROW }}
                  >
                    <svg
                      width={0}
                      height={0}
                      style={{ position: 'absolute' }}
                      aria-hidden
                    >
                      <filter
                        id={filterId}
                        x="-10%"
                        y="-120%"
                        width="120%"
                        height="340%"
                        colorInterpolationFilters="sRGB"
                      >
                        <feGaussianBlur
                          stdDeviation={`0 ${blur.toFixed(2)}`}
                        />
                      </filter>
                    </svg>

                    <div
                      style={{
                        height: ROW,
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: 48,
                        fontWeight: 900,
                        letterSpacing: -1.2,
                        whiteSpace: 'nowrap',
                        filter: blur > 0.05 ? `url(#${filterId})` : undefined,
                        opacity: op,
                        transform: `scaleY(${squash.toFixed(4)})`,
                        // Pure Settle Color: Turns into architectural accent color only on exact settle!
                        color: mixHex(
                          mutedColor,
                          accentColor,
                          clamp01(1 - d * 2.4)
                        ),
                      }}
                    >
                      {w}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Swiss Metadata Footer Line */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: `1px solid ${borderColor}`,
            paddingTop: 16,
            marginTop: 36,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 2,
            color: labelColor,
            textTransform: 'uppercase',
          }}
        >
          <div>PURE MECHANICAL WEIGHT · DAMPED SETTLE</div>
          <div>SWISS EDITORIAL GRID // 2026</div>
        </div>
      </div>
    </div>
  );
};
