import React, { useId } from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import { ensureFontsLoaded } from '../../src/styles/loadFonts';

ensureFontsLoaded();

export const GUOFENG_DURATION = 150; // 5.0s @ 30fps

export interface TypeEntranceGuofengProps {
  /** 主标题汉字，默认「重力觉醒」 */
  text?: string;
  /** 副标题，默认「字落千钧势破竹 · 瞬息回正定乾坤」 */
  subtitle?: string;
  /** 顶部卷标，默认「卷壹 · 汉字形意动力学 · 金石篇」 */
  chapter?: string;
  /** 顶部右侧对句/落款，默认「势若九鼎 · 落地生根」 */
  tagline?: string;
  /** 印章文字（2字），默认「觉醒」 */
  sealText?: string;
  /** 主题风格：'dark' 玄墨暗金 | 'light' 素宣朱砂 */
  tone?: 'dark' | 'light';
  /** 高亮金/赤朱色相 */
  accentGold?: string;
  accentRed?: string;
  /** 字号 */
  fontSize?: number;
  /** 地平线高度 */
  floorY?: number;
  /** 是否启用配套音效（落墨金石撞击 + 印章盖印 Snap 音） */
  enableAudio?: boolean;
}

// ==========================================
// 1. 物理缓动与数学
// ==========================================

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

const bezier = (x1: number, y1: number, x2: number, y2: number) => {
  if (x1 === y1 && x2 === y2) return (t: number) => clamp01(t);
  const ax = 1 - 3 * x2 + 3 * x1;
  const bx = 3 * x2 - 6 * x1;
  const cx = 3 * x1;
  const ay = 1 - 3 * y2 + 3 * y1;
  const by = 3 * y2 - 6 * y1;
  const cy = 3 * y1;
  const sx = (u: number) => ((ax * u + bx) * u + cx) * u;
  const sy = (u: number) => ((ay * u + by) * u + cy) * u;
  const dx = (u: number) => (3 * ax * u + 2 * bx) * u + cx;
  const solve = (x: number) => {
    let u = x;
    for (let i = 0; i < 8; i++) {
      const err = sx(u) - x;
      if (Math.abs(err) < 1e-7) return u;
      const d = dx(u);
      if (Math.abs(d) < 1e-6) break;
      u -= err / d;
    }
    let lo = 0;
    let hi = 1;
    u = x;
    for (let i = 0; i < 40; i++) {
      const v = sx(u);
      if (Math.abs(v - x) < 1e-7) break;
      if (v < x) lo = u;
      else hi = u;
      u = (lo + hi) / 2;
    }
    return u;
  };
  return (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : sy(solve(t)));
};

const EASE = {
  snappy: bezier(0.16, 1, 0.3, 1),
  out: bezier(0.22, 1, 0.36, 1),
  overshoot: bezier(0.34, 1.45, 0.64, 1),
  stamp: bezier(0.18, 1.3, 0.3, 1),
};

const ramp = (
  frame: number,
  start: number,
  dur: number,
  ease: (t: number) => number = EASE.snappy
) => ease(clamp01((frame - start) / Math.max(1e-6, dur)));

const mix = (a: number, b: number, t: number) => a + (b - a) * t;

const hash = (n: number) => {
  const s = Math.sin(n * 131.7 + 281.3) * 43758.5453;
  return s - Math.floor(s);
};

// 物理坠落常量
const DROP_DISTANCE = 740;
const T_FALL = 24;
const T_B1 = 16;
const T_B2 = 8;
const SNAP_FRAME = 110;
const SNAP_DUR = 6;

const dropY = (t: number): number => {
  if (t <= 0) return -DROP_DISTANCE;
  if (t < T_FALL) {
    return -DROP_DISTANCE + DROP_DISTANCE * Math.pow(t / T_FALL, 2);
  }
  if (t < T_FALL + T_B1) {
    const u = (t - T_FALL) / T_B1;
    return -DROP_DISTANCE * 0.28 * 4 * u * (1 - u);
  }
  if (t < T_FALL + T_B1 + T_B2) {
    const u = (t - T_FALL - T_B1) / T_B2;
    return -DROP_DISTANCE * 0.08 * 4 * u * (1 - u);
  }
  return 0;
};

const IMPACTS: [number, number][] = [
  [T_FALL, 1.15],
  [T_FALL + T_B1, 0.5],
  [T_FALL + T_B1 + T_B2, 0.2],
];

const squashAt = (t: number) => {
  let s = 0;
  for (const [t0, k] of IMPACTS) {
    const d = t - t0;
    if (d < 0 || d > 16) continue;
    s += k * Math.exp(-d / 2.5) * Math.cos(d * 0.88);
  }
  return s;
};

// 汉字从第4帧到第40帧逐渐硬加速起跳
const startOf = (i: number, len: number) => {
  if (len <= 1) return 4;
  return 4 + 36 * (1 - Math.pow(1 - i / (len - 1), 1.5));
};

// ==========================================
// 2. 国风视觉组件：宣纸纹理与金石印章
// ==========================================

const grainCache = new Map<string, string>();
const getGuofengGrain = (variant: number) => {
  const key = `g_gf_${variant}`;
  const hit = grainCache.get(key);
  if (hit) return hit;
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'>` +
    `<filter id='gf' x='0' y='0' width='100%' height='100%'>` +
    `<feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' seed='${variant * 23 + 11}' stitchTiles='stitch'/>` +
    `<feColorMatrix type='matrix' values='0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0 0 0 0 0 0 1'/>` +
    `</filter><rect width='100%' height='100%' filter='url(#gf)'/></svg>`;
  const url = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  grainCache.set(key, url);
  return url;
};

// 朱砂红印章组件
const CinnabarSeal: React.FC<{
  text: string;
  color: string;
  opacity: number;
  scale: number;
  rotation: number;
}> = ({ text, color, opacity, scale, rotation }) => {
  const chars = text.slice(0, 2).split('');
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: 44,
        height: 44,
        padding: 3,
        border: `2px solid ${color}`,
        borderRadius: 4,
        backgroundColor: `${color}18`,
        boxShadow: `inset 0 0 8px ${color}33, 0 0 12px ${color}44`,
        transform: `rotate(${rotation}deg) scale(${scale})`,
        opacity,
        transformOrigin: '50% 50%',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          border: `1px dashed ${color}AA`,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 14,
          lineHeight: 1.15,
          fontWeight: 900,
          color,
          fontFamily: '"Alibaba PuHuiTi", serif',
          letterSpacing: '0.04em',
        }}
      >
        {chars.map((c, idx) => (
          <span key={idx}>{c}</span>
        ))}
      </div>
    </div>
  );
};

// 汉字落地冲击水墨/金色光环
const GroundRipple: React.FC<{
  t: number;
  accent: string;
  dark: boolean;
}> = ({ t, accent, dark }) => {
  if (t < T_FALL || t > T_FALL + 16) return null;
  const p = (t - T_FALL) / 16;
  const scaleX = mix(0.2, 1.8, p);
  const scaleY = mix(0.1, 0.5, p);
  const opacity = (1 - p) * (dark ? 0.6 : 0.4);

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        width: 140,
        height: 28,
        transform: `translate(-50%, -50%) scale(${scaleX}, ${scaleY})`,
        borderRadius: '50%',
        border: `1.5px solid ${accent}`,
        opacity,
        filter: 'blur(1px)',
        pointerEvents: 'none',
      }}
    />
  );
};

// ==========================================
// 3. 国风主组件
// ==========================================

export const TypeEntranceGuofeng: React.FC<TypeEntranceGuofengProps> = ({
  text = '重力觉醒',
  subtitle = '字落千钧势破竹 · 瞬息回正定乾坤',
  chapter = '卷壹 · 汉字形意动力学 · 金石篇',
  tagline = '势若九鼎 · 落地生根',
  sealText = '形意',
  tone = 'dark',
  accentGold = '#E5C07B', // 古法哑光赤金
  accentRed = '#C23531', // 传统朱砂红
  fontSize = 200,
  floorY = 580,
  enableAudio = true,
}) => {
  const frame = useCurrentFrame();
  const isDark = tone === 'dark';

  // 背景色彩系统
  const bg = isDark
    ? 'radial-gradient(ellipse 90% 75% at 50% 30%, #17181F 0%, #0E0F14 55%, #07070A 100%)'
    : 'radial-gradient(ellipse 95% 85% at 50% 25%, #FAF7F0 0%, #F3EDE0 55%, #E9E1CE 100%)';

  const charColor = isDark ? '#FAF8F5' : '#1A1817';
  const subColor = isDark ? 'rgba(250, 248, 245, 0.75)' : 'rgba(26, 24, 23, 0.75)';
  const hudColor = isDark ? 'rgba(229, 192, 123, 0.65)' : 'rgba(194, 53, 49, 0.75)';
  const hairline = isDark ? 'rgba(229, 192, 123, 0.22)' : 'rgba(194, 53, 49, 0.2)';

  // 汉字排版计算
  const charArray = text.split('');
  const charCount = charArray.length;
  const baseOffset = Math.round(fontSize * 0.9);
  const rowTop = floorY - baseOffset;
  const pad = 190;

  // SNAP 帧立正计算
  const inhale = ramp(frame, SNAP_FRAME - 2, 2, EASE.out);
  const snap = ramp(frame, SNAP_FRAME, SNAP_DUR, EASE.snappy);
  const snapRot = ramp(frame, SNAP_FRAME, SNAP_DUR + 2, EASE.overshoot);
  const pulse = 0.055 * inhale * (1 - snap);

  // 印章盖印动画（frame 110-116）
  const sealProg = ramp(frame, SNAP_FRAME, 6, EASE.stamp);
  const sealScale = mix(1.7, 1.0, sealProg);
  const sealRot = mix(12, 0, sealProg);
  const sealOpacity = ramp(frame, SNAP_FRAME - 1, 3, EASE.out);

  // 副标题平滑渐起
  const subProg = ramp(frame, SNAP_FRAME + 4, 18, EASE.out);
  const subOpacity = subProg;
  const subTranslateY = (1 - subProg) * 14;

  // 顶部题签淡入
  const bannerProg = ramp(frame, 3, 22, EASE.out);

  return (
    <AbsoluteFill
      style={{
        backgroundImage: bg,
        backgroundColor: isDark ? '#090A0D' : '#F6F1E5',
        overflow: 'hidden',
        fontFamily:
          '"Alibaba PuHuiTi", "Songti SC", "SimSun", serif, sans-serif',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'geometricPrecision',
        userSelect: 'none',
      }}
    >
      {/* 1. 国风微光晕与氛围金尘 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isDark
            ? `radial-gradient(circle at 50% 50%, ${accentGold}14 0%, transparent 68%)`
            : `radial-gradient(circle at 50% 45%, ${accentRed}08 0%, transparent 65%)`,
          pointerEvents: 'none',
        }}
      />

      {/* 2. 顶部国风折页题跋与横卷装饰 */}
      <div
        style={{
          position: 'absolute',
          top: 48,
          left: 90,
          right: 90,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${hairline}`,
          paddingBottom: 16,
          opacity: bannerProg,
          color: hudColor,
          fontSize: 14,
          letterSpacing: '0.22em',
          fontWeight: 700,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* 朱砂小印点 */}
          <span
            style={{
              width: 8,
              height: 8,
              backgroundColor: accentRed,
              transform: 'rotate(45deg)',
              boxShadow: `0 0 8px ${accentRed}`,
            }}
          />
          <span style={{ color: isDark ? '#FAF8F5' : '#1A1817' }}>{chapter}</span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span style={{ fontSize: 12, letterSpacing: '0.12em', opacity: 0.85 }}>
            定格：百五十帧 · 顿挫入局
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: accentGold, letterSpacing: '0.18em' }}>
            {tagline}
          </span>
          <span style={{ opacity: 0.4 }}>//</span>
          <span style={{ fontSize: 12, opacity: 0.75 }}>
            ALIBABA PUHUITI 3.0 HEAVY
          </span>
        </div>
      </div>

      {/* 3. 仿金丝地平弦线与砚台台面 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: floorY,
          bottom: 0,
          background: isDark
            ? 'linear-gradient(180deg, rgba(229,192,123,0.04) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.85) 100%)'
            : 'linear-gradient(180deg, rgba(194,53,49,0.04) 0%, rgba(26,24,23,0.03) 40%, transparent 100%)',
        }}
      />
      {/* 金丝地平线 */}
      <div
        style={{
          position: 'absolute',
          left: 90,
          right: 90,
          top: floorY,
          height: 1.5,
          background: isDark
            ? `linear-gradient(90deg, transparent 0%, ${hairline} 15%, ${accentGold}88 50%, ${hairline} 85%, transparent 100%)`
            : `linear-gradient(90deg, transparent 0%, ${hairline} 15%, ${accentRed}88 50%, ${hairline} 85%, transparent 100%)`,
        }}
      />
      {/* 地平刻度铭文 */}
      <div
        style={{
          position: 'absolute',
          top: floorY + 10,
          left: 92,
          fontSize: 11,
          letterSpacing: '0.24em',
          color: hudColor,
          opacity: 0.65,
        }}
      >
        金石基准 · 伍佰捌拾尺
      </div>

      {/* 4. 核心字行：汉字逐字重力坠落、砸地弹跳与立正回正 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: rowTop,
          height: fontSize,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'baseline',
          fontSize,
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: '0.12em',
          color: charColor,
        }}
      >
        {charArray.map((ch, i) => {
          const t = frame - startOf(i, charCount);
          const y = dropY(t);
          const vy = dropY(t + 0.5) - dropY(t - 0.5);
          const air = -y;

          // 汉字触地歪斜角度（±5.5度）
          const tiltSeed = (hash(i * 17 + 9) - 0.5) * 11;
          const landProg = EASE.out(clamp01((t - T_FALL) / 6));
          const rot = tiltSeed * landProg * (1 - snapRot);

          // 汉字方块底角贴地补偿
          const jitter = -Math.sin((Math.abs(rot) * Math.PI) / 180) * (fontSize * 0.38);

          // 挤压形变 (Squash & Stretch)
          const stretch =
            Math.min(1, Math.abs(vy) / 60) * 0.12 * (t < T_FALL ? 1 : 0.5);
          const sq = squashAt(t);
          const sy = (1 + stretch) * (1 - 0.22 * sq) + pulse;
          const sx = (1 - stretch * 0.55) * (1 + 0.16 * sq) + pulse;

          // 墨晕投影
          const lift = clamp01(air / 460);
          const shadowOpacity =
            (t < 0 ? 0 : isDark ? 0.55 : 0.35) *
            (1 - lift * 0.88) *
            clamp01((t + 2) / 8);
          const shadowScaleX = mix(0.7, 1.45, lift) * (1 + 0.16 * Math.max(0, sq));
          const shadowBlur = mix(5, 30, lift);

          return (
            <span
              key={i}
              style={{
                position: 'relative',
                display: 'inline-block',
                margin: '0 16px',
              }}
            >
              {/* 真实占位宽 */}
              <span style={{ visibility: 'hidden' }}>{ch}</span>

              {/* 触地水墨扩散光环 */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: baseOffset,
                }}
              >
                <GroundRipple
                  t={t}
                  accent={isDark ? accentGold : accentRed}
                  dark={isDark}
                />
              </div>

              {/* 金石接触浓墨影 */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: baseOffset - 4,
                  width: '94%',
                  height: 16,
                  transform: `translateX(-50%) scaleX(${shadowScaleX.toFixed(3)})`,
                  borderRadius: '50%',
                  backgroundColor: isDark ? '#000000' : 'rgba(20, 18, 16, 0.95)',
                  opacity: shadowOpacity,
                  filter: `blur(${shadowBlur.toFixed(1)}px)`,
                  pointerEvents: 'none',
                }}
              />

              {/* 运动位移与旋转容器 */}
              <div
                style={{
                  position: 'absolute',
                  left: -pad,
                  right: -pad,
                  top: -pad,
                  bottom: -pad,
                  transform: `translateY(${(y + jitter).toFixed(2)}px)`,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: pad,
                    right: pad,
                    top: pad,
                    bottom: pad,
                    textAlign: 'center',
                    transform: `rotate(${rot.toFixed(3)}deg) scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`,
                    transformOrigin: '50% 90%',
                    textShadow: isDark
                      ? '0 2px 8px rgba(0,0,0,0.85)'
                      : '0 1px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  {ch}
                </div>
              </div>
            </span>
          );
        })}
      </div>

      {/* 5. 副标题区域：伴随朱砂印章盖落 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: floorY + 70,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
          opacity: subOpacity,
          transform: `translateY(${subTranslateY.toFixed(2)}px)`,
        }}
      >
        {/* 左侧朱砂印章 */}
        <CinnabarSeal
          text={sealText}
          color={accentRed}
          opacity={sealOpacity}
          scale={sealScale}
          rotation={sealRot}
        />

        {/* 诗意副标题 */}
        <div style={{ textAlign: 'left' }}>
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: subColor,
              letterSpacing: '0.14em',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <span>{subtitle}</span>
          </div>
          <div
            style={{
              fontSize: 12,
              letterSpacing: '0.3em',
              color: hudColor,
              marginTop: 4,
              fontFamily: 'monospace',
              textTransform: 'uppercase',
            }}
          >
            KINETIC HANZI · GRAVITY AWAKENING · ACT 01
          </div>
        </div>
      </div>

      {/* 6. 底部金石落款铭文 */}
      <div
        style={{
          position: 'absolute',
          bottom: 36,
          left: 90,
          right: 90,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 12,
          letterSpacing: '0.2em',
          color: hudColor,
          opacity: bannerProg,
        }}
      >
        <div>岁在丙午 · 墨沉千钧 // 终局真静止·帧百十六归位</div>
        <div>ALIBABA PUHUITI 3.0 · HEAVY GOLD KINETICS</div>
      </div>

      {/* 7. 宣纸/金石细微颗粒 (降低不透明度防视频编码模糊) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: isDark ? 0.025 : 0.02,
          mixBlendMode: isDark ? 'soft-light' : 'multiply',
          backgroundImage: getGuofengGrain(Math.floor(frame / 2) % 6),
          backgroundSize: '256px 256px',
        }}
      />

      {/* 8. 国风金石声音设计 */}
      {enableAudio && (
        <>
          {/* 四大汉字逐字下坠撞地声 (精确对齐各自落地瞬时) */}
          {charArray.map((_, i) => {
            const impactFrame = Math.round(startOf(i, charCount) + T_FALL);
            return (
              <Sequence
                key={`sfx-gf-drop-${i}`}
                from={impactFrame}
                durationInFrames={14}
              >
                <Audio
                  src={staticFile('audio/sfx/pop.mp3')}
                  volume={0.38 + 0.05 * (i % 2)}
                  playbackRate={0.88 - 0.04 * i} // 汉字越来越沉，音调逐字降低
                />
              </Sequence>
            );
          })}

          {/* 破空风势 (frame 104) */}
          <Sequence from={SNAP_FRAME - 7} durationInFrames={18}>
            <Audio
              src={staticFile('audio/sfx/whoosh-fast.mp3')}
              volume={0.24}
              playbackRate={1.2}
            />
          </Sequence>

          {/* 帧 110: 机械回正顿音 + 战鼓金石低吼 (印章盖下重音) */}
          <Sequence from={SNAP_FRAME} durationInFrames={30}>
            <Audio
              src={staticFile('audio/sfx/transition-snap.mp3')}
              volume={0.7}
            />
          </Sequence>
          <Sequence from={SNAP_FRAME} durationInFrames={40}>
            <Audio
              src={staticFile('audio/sfx/impact-cine.mp3')}
              volume={0.5}
            />
          </Sequence>
        </>
      )}
    </AbsoluteFill>
  );
};
