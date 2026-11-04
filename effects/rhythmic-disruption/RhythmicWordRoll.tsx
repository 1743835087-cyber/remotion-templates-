import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

// ==========================================
// 1. Math & Motion Primitives
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
// 2. Component Configuration
// ==========================================

export const RHYTHMIC_ROLL_DURATION = 160; // 5.33s (frames 50 to 210 in the main timeline)

const WORDS = ['CONVENTIONS', 'BOUNDARIES', 'LIMITATIONS', 'THE FUTURE'];
const ROW = 52; // Row height in design coordinates

// Beat-synced transition windows normalized to [0, 1]
// Relative to this component's local frame (duration 160):
// Step 1: starts frame 36, ends frame 52 (settles around frame 52, global frame 102)
// Step 2: starts frame 74, ends frame 90 (settles around frame 90, global frame 140)
// Step 3: starts frame 112, ends frame 128 (settles around frame 128, global frame 178)
const LOCAL_STEPS = [36 / 160, 74 / 160, 112 / 160];
const WINDOW_LEN = 16 / 160;

export const RhythmicWordRoll: React.FC<{
  accentColor?: string;
  accentDimColor?: string;
  textColor?: string;
}> = ({
  accentColor = '#00FF88', // Electric Cyber Lime
  accentDimColor = '#3A424E',
  textColor = '#FFFFFF',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.min(1, frame / Math.max(1, RHYTHMIC_ROLL_DURATION - 1));

  // Progress of the reel
  const reelAt = (timeVal: number) => {
    let p = 0;
    for (const s of LOCAL_STEPS) {
      const u = seg(timeVal, s, s + WINDOW_LEN);
      p += 0.7 * E.outQuint(u) + 0.3 * E.outBack(u);
    }
    return p;
  };

  const p = reelAt(t);

  // Speed-based motion blur
  const DT = 0.5 / (RHYTHMIC_ROLL_DURATION - 1);
  const speed = Math.abs(reelAt(t + DT) - reelAt(t - DT));
  const motionBlur = Math.min(6, speed * ROW * 0.28);

  // Punch Zoom on each settle point
  // Settle 1: frame 52
  // Settle 2: frame 90
  // Settle 3: frame 128 (Climax)
  const punch1 = spring({ frame: frame - 52, fps, config: { damping: 10, mass: 0.5 } });
  const punch2 = spring({ frame: frame - 90, fps, config: { damping: 10, mass: 0.5 } });
  const punch3 = spring({ frame: frame - 128, fps, config: { damping: 8, mass: 0.6 } });

  const punchScale =
    1 +
    (frame >= 52 && frame < 74 ? (1 - punch1) * 0.03 : 0) +
    (frame >= 90 && frame < 112 ? (1 - punch2) * 0.04 : 0) +
    (frame >= 128 ? (1 - punch3) * 0.06 : 0);

  // Climax glow explosion (frame 128 onwards)
  const climaxGlow = frame >= 128 ? Math.min(1, (frame - 128) / 8) : 0;

  // Entrance spring
  const enterSpring = spring({ frame, fps, config: { damping: 12 } });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${punchScale * enterSpring})`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          padding: '24px 40px',
          background: 'rgba(10, 13, 20, 0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 255, 136, 0.18)',
          borderRadius: 20,
          boxShadow: `0 20px 60px rgba(0, 0, 0, 0.8), 0 0 ${climaxGlow * 40}px rgba(0, 255, 136, ${climaxGlow * 0.35})`,
        }}
      >
        {/* Glowing Prefix Tag & Stem */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 3,
              color: accentColor,
              textTransform: 'uppercase',
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: accentColor,
                boxShadow: `0 0 10px ${accentColor}`,
                display: 'inline-block',
              }}
            />
            MISSION DISRUPT // 04
          </div>

          <div
            style={{
              fontSize: 44,
              fontWeight: 900,
              color: textColor,
              letterSpacing: -1.5,
              whiteSpace: 'nowrap',
              textShadow: '0 2px 20px rgba(0,0,0,0.8)',
            }}
          >
            BUILT TO DISRUPT
          </div>
        </div>

        {/* Vertical Divider Line with Pulse */}
        <div
          style={{
            width: 2,
            height: ROW * 2.2,
            background: `linear-gradient(180deg, transparent 0%, ${accentColor} 50%, transparent 100%)`,
            opacity: 0.6 + climaxGlow * 0.4,
          }}
        />

        {/* 3-Row Viewport with Vertical Gradient Mask */}
        <div
          style={{
            position: 'relative',
            height: ROW * 3,
            width: 320,
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
            {WORDS.map((w, i) => {
              const d = Math.abs(i - p);
              // Vertical Gaussian blur + motion blur
              const blur =
                (d < 1 ? 3.5 * d : 3.5 + 2.5 * Math.min(d - 1, 1)) +
                motionBlur;
              const op =
                d < 1
                  ? 1 - 0.65 * d
                  : Math.max(0.08, 0.35 - 0.23 * (d - 1));

              // Mechanical cylinder squash
              const squash = 1 - 0.15 * Math.min(1, d / 1.4);
              const filterId = `rhythmic-vroll-${i}`;

              // Final word bloom
              const isFinal = i === WORDS.length - 1;
              const textShadow =
                isFinal && d < 0.2
                  ? `0 0 25px ${accentColor}, 0 0 50px ${accentColor}`
                  : 'none';

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
                      <feGaussianBlur stdDeviation={`0 ${blur.toFixed(2)}`} />
                    </filter>
                  </svg>

                  <div
                    style={{
                      height: ROW,
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 44,
                      fontWeight: 900,
                      letterSpacing: -1,
                      whiteSpace: 'nowrap',
                      filter: blur > 0.05 ? `url(#${filterId})` : undefined,
                      opacity: op,
                      transform: `scaleY(${squash.toFixed(4)})`,
                      color: mixHex(
                        accentDimColor,
                        accentColor,
                        clamp01(1 - d * 2.4)
                      ),
                      textShadow,
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
    </div>
  );
};
