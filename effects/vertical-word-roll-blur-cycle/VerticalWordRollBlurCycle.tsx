import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// ==========================================
// 1. Math, Easing & Deterministic Motion
// ==========================================

export const E = {
  linear: (t: number) => t,
  outQuint: (t: number) => 1 - Math.pow(1 - t, 5),
  outBack: (t: number, s = 1.70158) =>
    1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2),
};

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const seg = (
  t: number,
  t0: number,
  t1: number,
  ease: (x: number) => number = E.linear
) => ease(Math.min(1, Math.max(0, (t - t0) / (t1 - t0))));

// Hex color mix (rgb linear interpolate)
export const mixHex = (a: string, b: string, k: number) => {
  k = clamp01(k);
  const cleanA = a.replace('#', '');
  const cleanB = b.replace('#', '');
  const pa = [0, 2, 4].map((i) => parseInt(cleanA.slice(i, i + 2), 16));
  const pb = [0, 2, 4].map((i) => parseInt(cleanB.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * k));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};

// Deterministic hash for noise
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// ==========================================
// 2. Visual Polish: Grain & Backdrop
// ==========================================

const grainCache = new Map<string, string>();
const grainTile = (variant: number, tile: number, freq: number) => {
  const key = `${variant}|${tile}|${freq}`;
  const hit = grainCache.get(key);
  if (hit) return hit;
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${tile}' height='${tile}'>` +
    `<filter id='g' x='0' y='0' width='100%' height='100%' color-interpolation-filters='sRGB'>` +
    `<feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='2' seed='${variant * 17 + 3}' stitchTiles='stitch'/>` +
    `<feColorMatrix type='matrix' values='0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0 0 0 0 1'/>` +
    `<feComponentTransfer><feFuncR type='linear' slope='2.4' intercept='-0.7'/><feFuncG type='linear' slope='2.4' intercept='-0.7'/>` +
    `<feFuncB type='linear' slope='2.4' intercept='-0.7'/></feComponentTransfer></filter>` +
    `<rect width='100%' height='100%' filter='url(#g)'/></svg>`;
  const url = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  grainCache.set(key, url);
  return url;
};

export const Grain: React.FC<{
  opacity?: number;
  step?: number;
  scale?: number;
  freq?: number;
  blend?: React.CSSProperties['mixBlendMode'];
}> = ({ opacity = 0.05, step = 2, scale = 1, freq = 0.85, blend = 'overlay' }) => {
  const frame = useCurrentFrame();
  const k = Math.floor(frame / Math.max(1, step));
  const tile = 256;
  const ox = Math.floor(hash(k * 3 + 1) * tile);
  const oy = Math.floor(hash(k * 7 + 2) * tile);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity,
        mixBlendMode: blend,
        backgroundImage: grainTile(k % 6, tile, freq),
        backgroundSize: `${tile * scale}px ${tile * scale}px`,
        backgroundPosition: `${ox}px ${oy}px`,
      }}
    />
  );
};

export const Backdrop: React.FC<{
  tone?: 'light' | 'dark';
  accent?: string;
  vignette?: number;
}> = ({ tone = 'light', accent = '#5b63d3', vignette = 0.12 }) => {
  const isDark = tone === 'dark';
  const base = isDark
    ? 'linear-gradient(180deg, #13151b 0%, #0c0d11 55%, #08090c 100%)'
    : 'linear-gradient(180deg, #f6f6f4 0%, #efefec 55%, #e8e8e4 100%)';
  const glow = isDark ? 'rgba(150,160,200,0.16)' : 'rgba(255,255,255,0.95)';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: base,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 62% 70% at 50% 30%, ${glow} 0%, rgba(255,255,255,0) 72%)`,
        }}
      />
      {/* Subtle Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `radial-gradient(ellipse 75% 75% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,${vignette}) 100%)`,
        }}
      />
    </div>
  );
};

// Design Stage Container (480x270 coordinates)
export const DesignStage: React.FC<{
  w?: number;
  h?: number;
  bg?: string;
  children: React.ReactNode;
}> = ({ w = 480, h = 270, bg, children }) => {
  const { width } = useVideoConfig();
  const scale = width / w;
  return (
    <AbsoluteFill style={{ background: bg ?? '#000', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: w,
          height: h,
          overflow: 'hidden',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// 3. Component Props & Core Timing
// ==========================================

export const VERTICAL_WORD_ROLL_BLUR_CYCLE_DURATION = 150; // 5.0s @ 30fps

export interface VerticalWordRollBlurCycleProps {
  prefix?: string;
  words?: string[];
  accentColor?: string;
  accentDimColor?: string;
  inkColor?: string;
  bgColor?: string;
  tone?: 'light' | 'dark';
  maskWidth?: number;
  enableSfx?: boolean;
  fontFamily?: string;
}

const DEFAULT_WORDS = ['Launches', 'Demos', 'Promos', 'Every Shot'];
const ROW = 44;
// 3 transitions at t = [0.16, 0.36, 0.56], duration = 0.11 (~16 frames / 0.55s)
const STEPS = [0.16, 0.36, 0.56];

export const VerticalWordRollBlurCycle: React.FC<VerticalWordRollBlurCycleProps> = ({
  prefix = 'Crafted for',
  words = DEFAULT_WORDS,
  accentColor = '#5b63d3',
  accentDimColor = '#B9B9BE',
  inkColor = '#17181c',
  bgColor = '#F4F4F2',
  tone = 'light',
  maskWidth = 190,
  enableSfx = true,
  fontFamily = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Alibaba PuHuiTi", Inter, sans-serif',
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = Math.min(1, frame / Math.max(1, durationInFrames - 1));

  // Reel progress p: 0.7*outQuint + 0.3*outBack per step
  const reelAt = (timeVal: number) => {
    let progress = 0;
    for (const s of STEPS) {
      const u = seg(timeVal, s, s + 0.11);
      progress += 0.7 * E.outQuint(u) + 0.3 * E.outBack(u);
    }
    return progress;
  };

  const p = reelAt(t);

  // Speed-based vertical motion blur
  const DT = 0.5 / (durationInFrames - 1);
  const speed = Math.abs(reelAt(t + DT) - reelAt(t - DT));
  const motionBlur = Math.min(4, speed * ROW * 0.22);

  // Exit fade out at end (0.9 to 0.985)
  const exitOpacity = 1 - seg(t, 0.9, 0.985) * 0.999;

  // Settle frame calculations:
  // Step 1: 0.16 + 0.11 = 0.27 -> frame ~ 40
  // Step 2: 0.36 + 0.11 = 0.47 -> frame ~ 70
  // Step 3: 0.56 + 0.11 = 0.67 -> frame ~ 100
  const settleF1 = Math.round((STEPS[0] + 0.11) * (durationInFrames - 1));
  const settleF2 = Math.round((STEPS[1] + 0.11) * (durationInFrames - 1));
  const settleF3 = Math.round((STEPS[2] + 0.11) * (durationInFrames - 1));

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* Audio SFX: Mechanical click/snap on settle points */}
      {enableSfx && (
        <>
          <Sequence from={settleF1} durationInFrames={15}>
            <Audio src={staticFile('audio/sfx/click-camera.mp3')} volume={0.45} />
          </Sequence>
          <Sequence from={settleF2} durationInFrames={15}>
            <Audio src={staticFile('audio/sfx/transition-snap.mp3')} volume={0.4} />
          </Sequence>
          <Sequence from={settleF3} durationInFrames={15}>
            <Audio src={staticFile('audio/sfx/click-camera.mp3')} volume={0.5} />
          </Sequence>
        </>
      )}

      {/* 480x270 Design Stage scaled to 1920x1080 */}
      <DesignStage bg={bgColor}>
        <Backdrop
          tone={tone}
          accent={accentColor}
          vignette={tone === 'dark' ? 0.35 : 0.12}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              opacity: exitOpacity,
            }}
          >
            {/* Fixed Prefix Sentence Stem */}
            <div
              style={{
                fontSize: 30,
                fontWeight: 800,
                color: inkColor,
                letterSpacing: -0.5,
                whiteSpace: 'nowrap',
              }}
            >
              {prefix}
            </div>

            {/* 3-Row Viewport Window with Soft Edge Gradient Mask */}
            <div
              style={{
                position: 'relative',
                height: ROW * 3,
                width: maskWidth,
                overflow: 'hidden',
                WebkitMaskImage:
                  'linear-gradient(180deg, transparent 0%, #000 26%, #000 74%, transparent 100%)',
                maskImage:
                  'linear-gradient(180deg, transparent 0%, #000 26%, #000 74%, transparent 100%)',
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
                  // Adjacent row vertical gaussian blur: 0->3px in 1 row, 3->5px further
                  const blur =
                    (d < 1 ? 3 * d : 3 + 2 * Math.min(d - 1, 1)) + motionBlur;
                  const op =
                    d < 1
                      ? 1 - 0.65 * d
                      : Math.max(0.1, 0.35 - 0.23 * (d - 1));

                  // Cylinder drum squash: up to 14% scaleY compression
                  const squash = 1 - 0.14 * Math.min(1, d / 1.4);
                  const filterId = `vroll-blur-${i}`;

                  return (
                    <div key={`${w}-${i}`} style={{ position: 'relative', height: ROW }}>
                      {/* Pure vertical SVG gaussian blur */}
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
                          fontSize: 30,
                          fontWeight: 800,
                          letterSpacing: -0.5,
                          whiteSpace: 'nowrap',
                          filter: blur > 0.05 ? `url(#${filterId})` : undefined,
                          opacity: op,
                          transform: `scaleY(${squash.toFixed(4)})`,
                          // Settle tint: only colors up when d is very small (<0.42)
                          color: mixHex(
                            accentDimColor,
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
        </div>
      </DesignStage>

      {/* Screen-space grain texture */}
      <Grain opacity={tone === 'dark' ? 0.07 : 0.04} />
    </div>
  );
};
