import React, { useEffect, useState } from 'react';
import {
  AbsoluteFill,
  Audio,
  continueRender,
  delayRender,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { RhythmicWordRoll } from './RhythmicWordRoll';
import { ensureFontsLoaded } from '../../src/styles/loadFonts';
import '../../src/styles/fonts.css';

// Ensure Alibaba PuHuiTi fonts are loaded
ensureFontsLoaded();

export const RHYTHMIC_DISRUPTION_DURATION = 260; // 8.67s @ 30fps

// ==========================================
// Phase 1: High-Speed Kinetic Flash Intro
// ==========================================
const FlashIntro: React.FC = () => {
  const frame = useCurrentFrame();

  // 3 rapid cuts
  if (frame < 16) {
    const scale = 1 + frame * 0.015;
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${scale})`,
        }}
      >
        <div
          style={{
            fontSize: 20,
            letterSpacing: 6,
            fontWeight: 800,
            color: '#00FF88',
            marginBottom: 12,
          }}
        >
          [ PHASE 01 // OVERRIDE ]
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 900,
            letterSpacing: -2,
            color: '#FFFFFF',
            textShadow: '0 0 30px rgba(0, 255, 136, 0.4)',
          }}
        >
          STOP WAITING.
        </div>
        <div style={{ fontSize: 24, fontWeight: 600, color: '#8892B0', marginTop: 8 }}>
          打破一切陈规与延迟
        </div>
      </div>
    );
  }

  if (frame < 32) {
    const fRel = frame - 16;
    const scale = 1 + fRel * 0.015;
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${scale})`,
        }}
      >
        <div
          style={{
            fontSize: 20,
            letterSpacing: 6,
            fontWeight: 800,
            color: '#00F0FF',
            marginBottom: 12,
          }}
        >
          [ PHASE 02 // RECODE ]
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 900,
            letterSpacing: -2,
            color: '#FFFFFF',
            textShadow: '0 0 30px rgba(0, 240, 255, 0.4)',
          }}
        >
          START ACCELERATING.
        </div>
        <div style={{ fontSize: 24, fontWeight: 600, color: '#8892B0', marginTop: 8 }}>
          光速重构智能流水线
        </div>
      </div>
    );
  }

  // Frame 32 - 50: Boom into center
  const fRel = frame - 32;
  const zoomIn = 1 + (fRel / 18) * 0.25;
  const opacity = interpolate(fRel, [14, 18], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${zoomIn})`,
        opacity,
      }}
    >
      <div
        style={{
          fontSize: 22,
          letterSpacing: 8,
          fontWeight: 900,
          color: '#FF0055',
          marginBottom: 12,
        }}
      >
        [ PHASE 03 // IGNITE ]
      </div>
      <div
        style={{
          fontSize: 88,
          fontWeight: 900,
          letterSpacing: -3,
          color: '#FFFFFF',
          textShadow: '0 0 40px rgba(255, 0, 85, 0.6)',
        }}
      >
        UNLEASH POWER.
      </div>
    </div>
  );
};

// ==========================================
// Phase 3: Outro Brand Lockup
// ==========================================
const BrandOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 11, mass: 0.7 } });
  const sweepPos = interpolate(frame, [10, 40], [-100, 200], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${0.9 + entrance * 0.1})`,
        opacity: entrance,
      }}
    >
      {/* Top Pill Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 20px',
          background: 'rgba(0, 255, 136, 0.1)',
          border: '1px solid rgba(0, 255, 136, 0.3)',
          borderRadius: 100,
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 4,
          color: '#00FF88',
          marginBottom: 24,
          textTransform: 'uppercase',
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#00FF88',
            boxShadow: '0 0 8px #00FF88',
          }}
        />
        ANTIGRAVITY // ENGINE LOADED
      </div>

      {/* Main Brand Title with Light Sweep */}
      <div
        style={{
          position: 'relative',
          fontSize: 84,
          fontWeight: 900,
          letterSpacing: -2,
          color: '#FFFFFF',
          textTransform: 'uppercase',
          overflow: 'hidden',
          padding: '0 20px',
        }}
      >
        REWRITE THE RULES
        {/* Diagonal Light Sweep */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${sweepPos}%`,
            width: 80,
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
            transform: 'skewX(-25deg)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: 26,
          fontWeight: 600,
          color: '#8E9AAF',
          letterSpacing: 2,
          marginTop: 16,
        }}
      >
        极限帧率 · 确定性渲染 · 震撼动感
      </div>

      {/* Bottom Spec Pills */}
      <div style={{ display: 'flex', gap: 20, marginTop: 36 }}>
        {['100% DETERMINISTIC', 'ZERO LATENCY', 'NEXT-GEN AI CRAFT'].map(
          (item) => (
            <div
              key={item}
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2,
                color: '#4E5A70',
                padding: '6px 16px',
                borderRadius: 6,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(255, 255, 255, 0.02)',
              }}
            >
              {item}
            </div>
          )
        )}
      </div>
    </div>
  );
};

// ==========================================
// Main Composition: RhythmicDisruptionAnimation
// ==========================================
export const RhythmicDisruptionAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const [handle] = useState(() =>
    delayRender('Loading fonts for RhythmicDisruptionAnimation')
  );

  useEffect(() => {
    ensureFontsLoaded()
      .then(() => continueRender(handle))
      .catch((err) => {
        console.error('Font loading error:', err);
        continueRender(handle);
      });
  }, [handle]);

  // Dynamic Audio BGM automation (124 BPM House Beat)
  const bgmVolume = interpolate(
    frame,
    [0, 15, 235, 260],
    [0, 0.85, 0.85, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Background beat kick pulse (124 BPM = ~14.5 frames per beat)
  const beatPhase = (frame % 14.5) / 14.5;
  const beatPulse = Math.exp(-beatPhase * 6); // Sharp decay per kick
  const bgBrightness = 0.05 + beatPulse * 0.05;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#05070B',
        overflow: 'hidden',
        fontFamily: "'Alibaba PuHuiTi', sans-serif",
      }}
    >
      {/* ────────────────── Audio Layer ────────────────── */}
      {/* Background BGM */}
      <Audio src={staticFile('house-vibez.mp3')} volume={bgmVolume} />

      {/* SFX: Intro Flash Whoosh & Riser */}
      <Sequence from={0} durationInFrames={20}>
        <Audio src={staticFile('audio/sfx/whoosh-fast.mp3')} volume={0.65} />
      </Sequence>
      <Sequence from={20} durationInFrames={30}>
        <Audio src={staticFile('audio/sfx/riser-cine.mp3')} volume={0.5} />
      </Sequence>

      {/* SFX: Transition into Word Roll */}
      <Sequence from={48} durationInFrames={35}>
        <Audio src={staticFile('audio/sfx/impact-cine.mp3')} volume={0.7} />
      </Sequence>

      {/* SFX: Word Roll 3-Step Settle Snaps */}
      {/* Step 1 Settle: global frame 50 + 52 = 102 */}
      <Sequence from={102} durationInFrames={15}>
        <Audio src={staticFile('audio/sfx/click-camera.mp3')} volume={0.55} />
      </Sequence>

      {/* Step 2 Settle: global frame 50 + 90 = 140 */}
      <Sequence from={140} durationInFrames={15}>
        <Audio src={staticFile('audio/sfx/transition-snap.mp3')} volume={0.6} />
      </Sequence>

      {/* Step 3 Climax Settle: global frame 50 + 128 = 178 */}
      <Sequence from={178} durationInFrames={40}>
        <Audio src={staticFile('audio/sfx/impact-cine.mp3')} volume={0.8} />
      </Sequence>
      <Sequence from={178} durationInFrames={15}>
        <Audio src={staticFile('audio/sfx/click-camera.mp3')} volume={0.65} />
      </Sequence>

      {/* SFX: Outro Slam */}
      <Sequence from={210} durationInFrames={20}>
        <Audio src={staticFile('audio/sfx/whoosh-fast.mp3')} volume={0.6} />
      </Sequence>
      <Sequence from={212} durationInFrames={45}>
        <Audio src={staticFile('audio/sfx/impact-cine.mp3')} volume={0.75} />
      </Sequence>

      {/* ────────────────── Visual Background ────────────────── */}
      {/* Beat-pulsing Cyber Grid Floor */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at 50% 50%, rgba(0, 255, 136, ${bgBrightness}) 0%, transparent 75%),
            linear-gradient(180deg, #05070B 0%, #080C14 50%, #040608 100%)
          `,
        }}
      />

      {/* Perspective Grid Lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.7 + beatPulse * 0.3,
        }}
      />

      {/* Top & Bottom Cyber HUD Status Bars */}
      <div
        style={{
          position: 'absolute',
          top: 36,
          left: 60,
          right: 60,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 2,
          color: '#4B5568',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          paddingBottom: 12,
        }}
      >
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <span style={{ color: '#00FF88' }}>● SYSTEM ONLINE</span>
          <span>BPM: 124 // 4/4 TIME</span>
          <span>MOTION: KINETIC WORD ROLL</span>
        </div>
        <div>TC: {Math.floor(frame / 30).toString().padStart(2, '0')}:{(frame % 30).toString().padStart(2, '0')}:30</div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 36,
          left: 60,
          right: 60,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 2,
          color: '#4B5568',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: 12,
        }}
      >
        <div>RESOLUTION: 1920×1080 @ 30FPS</div>
        <div>ANTIGRAVITY CINEMATIC CRAFT</div>
      </div>

      {/* ────────────────── Sequence Pipeline ────────────────── */}
      {/* 1. Flash Intro (0 - 50f / 1.67s) */}
      <Sequence from={0} durationInFrames={50}>
        <FlashIntro />
      </Sequence>

      {/* 2. Centerpiece Rhythmic Word Roll (50 - 210f / 5.33s) */}
      <Sequence from={50} durationInFrames={160}>
        <RhythmicWordRoll />
      </Sequence>

      {/* 3. Outro Brand Lockup (210 - 260f / 1.67s) */}
      <Sequence from={210} durationInFrames={50}>
        <BrandOutro />
      </Sequence>
    </AbsoluteFill>
  );
};
