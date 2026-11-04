import React, { useEffect, useState } from 'react';
import {
  AbsoluteFill,
  Audio,
  continueRender,
  delayRender,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  KineticEditorialRoll,
  KineticEditorialRollProps,
} from './KineticEditorialRoll';
import { ensureFontsLoaded } from '../../src/styles/loadFonts';
import '../../src/styles/fonts.css';

// Ensure fonts are loaded
ensureFontsLoaded();

export const KINETIC_EDITORIAL_DURATION = 240; // 8.0s @ 30fps

// Subtle tactile film grain (deterministic noise)
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const grainCache = new Map<string, string>();
const grainTile = (variant: number) => {
  const key = `grain-${variant}`;
  const hit = grainCache.get(key);
  if (hit) return hit;
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'>` +
    `<filter id='g' x='0' y='0' width='100%' height='100%' color-interpolation-filters='sRGB'>` +
    `<feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='${variant * 17 + 3}' stitchTiles='stitch'/>` +
    `<feColorMatrix type='matrix' values='0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0 0 0 0 1'/>` +
    `<feComponentTransfer><feFuncR type='linear' slope='2.2' intercept='-0.6'/><feFuncG type='linear' slope='2.2' intercept='-0.6'/>` +
    `<feFuncB type='linear' slope='2.2' intercept='-0.6'/></feComponentTransfer></filter>` +
    `<rect width='100%' height='100%' filter='url(#g)'/></svg>`;
  const url = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  grainCache.set(key, url);
  return url;
};

// ==========================================
// Dark Architectural Editorial Composition
// ==========================================
export const KineticEditorialDark: React.FC<KineticEditorialRollProps> = (
  props
) => {
  const frame = useCurrentFrame();
  const [handle] = useState(() =>
    delayRender('Loading fonts for KineticEditorialDark')
  );

  useEffect(() => {
    ensureFontsLoaded()
      .then(() => continueRender(handle))
      .catch((err) => {
        console.error('Font loading error:', err);
        continueRender(handle);
      });
  }, [handle]);

  // Audio BGM volume automation curve (smooth in & out, no abrupt clipping)
  const bgmVolume = interpolate(
    frame,
    [0, 20, 215, 240],
    [0, 0.75, 0.75, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const k = Math.floor(frame / 2);
  const ox = Math.floor(hash(k * 3 + 1) * 256);
  const oy = Math.floor(hash(k * 7 + 2) * 256);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0C0D10', // Matte Obsidian Gallery Slate
        overflow: 'hidden',
      }}
    >
      {/* ────────────────── Audio Layer (Groove & Foley) ────────────────── */}
      {/* 103 BPM Stylish Hip Hop Groove */}
      <Audio src={staticFile('tonight-hiphop.mp3')} volume={bgmVolume} />

      {/* Settle Shutter Foley (Authentic Mechanical Clicks, No Game Bloops) */}
      {/* Step 1 Settle: Frame 78 */}
      <Sequence from={78} durationInFrames={15}>
        <Audio src={staticFile('audio/sfx/click-camera.mp3')} volume={0.45} />
      </Sequence>

      {/* Step 2 Settle: Frame 133 */}
      <Sequence from={133} durationInFrames={15}>
        <Audio src={staticFile('audio/sfx/transition-snap.mp3')} volume={0.4} />
      </Sequence>

      {/* Step 3 Climax Settle: Frame 183 */}
      <Sequence from={183} durationInFrames={20}>
        <Audio src={staticFile('audio/sfx/click-camera.mp3')} volume={0.55} />
      </Sequence>

      {/* ────────────────── Visual Atmosphere ────────────────── */}
      {/* Soft Studio Radial Lighting */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 65% 65% at 50% 45%, rgba(255, 255, 255, 0.04) 0%, transparent 80%)',
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* Main Kinetic Editorial Component */}
      <KineticEditorialRoll theme="dark" {...props} />

      {/* Tactile Film Grain */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.045,
          mixBlendMode: 'overlay',
          backgroundImage: grainTile(k % 6),
          backgroundPosition: `${ox}px ${oy}px`,
        }}
      />
    </AbsoluteFill>
  );
};

// ==========================================
// Light Swiss Paper Editorial Composition
// ==========================================
export const KineticEditorialLight: React.FC<KineticEditorialRollProps> = (
  props
) => {
  const frame = useCurrentFrame();
  const [handle] = useState(() =>
    delayRender('Loading fonts for KineticEditorialLight')
  );

  useEffect(() => {
    ensureFontsLoaded()
      .then(() => continueRender(handle))
      .catch((err) => {
        console.error('Font loading error:', err);
        continueRender(handle);
      });
  }, [handle]);

  const bgmVolume = interpolate(
    frame,
    [0, 20, 215, 240],
    [0, 0.7, 0.7, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const k = Math.floor(frame / 2);
  const ox = Math.floor(hash(k * 3 + 1) * 256);
  const oy = Math.floor(hash(k * 7 + 2) * 256);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#F5F4EE', // Warm Architectural Stone Paper
        overflow: 'hidden',
      }}
    >
      {/* ────────────────── Audio Layer ────────────────── */}
      <Audio src={staticFile('tonight-hiphop.mp3')} volume={bgmVolume} />

      {/* Settle Shutter Foley */}
      <Sequence from={78} durationInFrames={15}>
        <Audio src={staticFile('audio/sfx/click-camera.mp3')} volume={0.45} />
      </Sequence>
      <Sequence from={133} durationInFrames={15}>
        <Audio src={staticFile('audio/sfx/transition-snap.mp3')} volume={0.4} />
      </Sequence>
      <Sequence from={183} durationInFrames={20}>
        <Audio src={staticFile('audio/sfx/click-camera.mp3')} volume={0.55} />
      </Sequence>

      {/* ────────────────── Visual Atmosphere ────────────────── */}
      {/* Soft Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 75% 75% at 50% 50%, rgba(0,0,0,0) 50%, rgba(30,30,30,0.06) 100%)',
        }}
      />

      {/* Main Kinetic Editorial Component */}
      <KineticEditorialRoll
        theme="light"
        accentColor="#EE2722" // Swiss Vermilion Red
        {...props}
      />

      {/* Tactile Paper Grain */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.035,
          mixBlendMode: 'multiply',
          backgroundImage: grainTile(k % 6),
          backgroundPosition: `${ox}px ${oy}px`,
        }}
      />
    </AbsoluteFill>
  );
};
