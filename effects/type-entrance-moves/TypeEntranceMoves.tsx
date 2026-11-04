import React, { useId } from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { ensureFontsLoaded } from '../../src/styles/loadFonts';

ensureFontsLoaded();

export const TYPE_ENTRANCE_MOVES_DURATION = 150; // 5.0s @ 30fps

export interface TypeEntranceMovesProps {
  /** 主标题文字（推荐大写英文字母或汉字，如 GRAVITY、重力破界、DISRUPT） */
  text?: string;
  /** 副标题文字 */
  subtitle?: string;
  /** 顶部标签/类别标识 */
  category?: string;
  /** 顶部右侧技术参数说明 */
  tagline?: string;
  /** 主题风格：'dark' 深色赛博科技 | 'light' 经典瑞士白底 */
  tone?: 'dark' | 'light';
  /** 高亮强调色 */
  accentColor?: string;
  /** 主字号（默认 176） */
  fontSize?: number;
  /** 地面水平线位置（默认 600px） */
  floorY?: number;
  /** 是否启用配套音效（逐字撞地音 + 集体立正一拍 Snap 音） */
  enableAudio?: boolean;
}

// ==========================================
// 1. 数学、缓动与伪随机工具
// ==========================================

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

// 贝塞尔求解器
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
};

const ramp = (
  frame: number,
  start: number,
  dur: number,
  ease: (t: number) => number = EASE.snappy
) => ease(clamp01((frame - start) / Math.max(1e-6, dur)));

const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// 确定性伪随机
const hash = (n: number) => {
  const s = Math.sin(n * 127.3 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// ==========================================
// 2. 物理与下落常量
// ==========================================

const DROP_DISTANCE = 720; // 字符坠落初高度
const T_FALL = 24; // 重力下落落地用时
const T_B1 = 16; // 第一次衰减弹跳时长 (30% 峰高)
const T_B2 = 8; // 第二次衰减弹跳时长 (9% 峰高)
const SNAP_FRAME = 110; // 全体立正归位帧
const SNAP_DUR = 6; // 立正过渡帧长

// 计算单字符纵向位移（负数代表在地面以上）
const dropY = (t: number): number => {
  if (t <= 0) return -DROP_DISTANCE;
  if (t < T_FALL) {
    // 重力自由落体加速 y = -D + D * (t / 24)^2
    return -DROP_DISTANCE + DROP_DISTANCE * Math.pow(t / T_FALL, 2);
  }
  if (t < T_FALL + T_B1) {
    // 第一次弹跳（抛物线 4u(1-u)，高度 30%）
    const u = (t - T_FALL) / T_B1;
    return -DROP_DISTANCE * 0.3 * 4 * u * (1 - u);
  }
  if (t < T_FALL + T_B1 + T_B2) {
    // 第二次弹跳（抛物线 4u(1-u)，高度 9%）
    const u = (t - T_FALL - T_B1) / T_B2;
    return -DROP_DISTANCE * 0.09 * 4 * u * (1 - u);
  }
  return 0;
};

// 触地挤压量 (Squash & Stretch)：三次触地各给一次阻尼振荡
const IMPACTS: [number, number][] = [
  [T_FALL, 1.0],
  [T_FALL + T_B1, 0.45],
  [T_FALL + T_B1 + T_B2, 0.18],
];

const squashAt = (t: number) => {
  let s = 0;
  for (const [t0, k] of IMPACTS) {
    const d = t - t0;
    if (d < 0 || d > 16) continue;
    s += k * Math.exp(-d / 2.6) * Math.cos(d * 0.85);
  }
  return s;
};

// 起跳帧计算：非等差错峰，首字4f，尾字40f，间隔越来越密 (R2 硬加速)
const startOf = (i: number, len: number) => {
  if (len <= 1) return 4;
  return 4 + 36 * (1 - Math.pow(1 - i / (len - 1), 1.5));
};

// ==========================================
// 3. 视觉小组件：胶片噪点与运动模糊
// ==========================================

const grainCache = new Map<string, string>();
const getGrainTile = (variant: number) => {
  const key = `g_${variant}`;
  const hit = grainCache.get(key);
  if (hit) return hit;
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'>` +
    `<filter id='g' x='0' y='0' width='100%' height='100%'>` +
    `<feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='${variant * 19 + 7}' stitchTiles='stitch'/>` +
    `<feColorMatrix type='matrix' values='0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0 0 0 0 1'/>` +
    `</filter><rect width='100%' height='100%' filter='url(#g)'/></svg>`;
  const url = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  grainCache.set(key, url);
  return url;
};

const GrainOverlay: React.FC<{ opacity: number; dark: boolean }> = ({
  opacity,
  dark,
}) => {
  const frame = useCurrentFrame();
  const k = Math.floor(frame / 2);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity,
        mixBlendMode: dark ? 'soft-light' : 'overlay',
        backgroundImage: getGrainTile(k % 6),
        backgroundSize: '256px 256px',
      }}
    />
  );
};

// 纵向运动模糊包装组件
const SpeedBlurVertical: React.FC<{
  vy: number;
  amount?: number;
  max?: number;
  children: React.ReactNode;
}> = ({ vy, amount = 0.28, max = 18, children }) => {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const sd = Math.min(max, Math.abs(vy) * amount);

  if (sd < 0.4) {
    return <div style={{ position: 'absolute', inset: 0 }}>{children}</div>;
  }

  const filterId = `blur-v-${id}`;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <svg width={0} height={0} style={{ position: 'absolute' }}>
        <filter
          id={filterId}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation={`0 ${sd.toFixed(2)}`} />
        </filter>
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          filter: `url(#${filterId})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// ==========================================
// 4. 主组件实现
// ==========================================

export const TypeEntranceMoves: React.FC<TypeEntranceMovesProps> = ({
  text = 'GRAVITY',
  subtitle = '打破重力界限 · 让每一个落点皆是节拍',
  category = 'TYPE-ENTRANCE-MOVES // 01',
  tagline = 'DAMPED OSCILLATION & KINETIC SYNCHRONIZATION',
  tone = 'dark',
  accentColor = '#00F5FF',
  fontSize = 176,
  floorY = 590,
  enableAudio = true,
}) => {
  const frame = useCurrentFrame();
  const isDark = tone === 'dark';

  // 颜色系统定义
  const bg = isDark
    ? 'linear-gradient(180deg, #090B10 0%, #0E121A 50%, #06080C 100%)'
    : 'linear-gradient(180deg, #F8F9FA 0%, #F1F3F5 55%, #E9ECEF 100%)';
  const mainInk = isDark ? '#FFFFFF' : '#14161F';
  const subInk = isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(20, 22, 31, 0.65)';
  const hudDim = isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(20, 22, 31, 0.4)';
  const hairlineColor = isDark
    ? 'rgba(255, 255, 255, 0.12)'
    : 'rgba(20, 22, 31, 0.12)';
  const groundGlow = isDark
    ? `radial-gradient(ellipse 65% 55% at 50% 100%, ${accentColor}26 0%, transparent 70%)`
    : `radial-gradient(ellipse 65% 55% at 50% 100%, ${accentColor}18 0%, transparent 70%)`;

  // 尺寸与排版基准
  const charArray = text.split('');
  const charCount = charArray.length;
  const baseOffset = Math.round(fontSize * 0.88); // 字体基线偏移
  const rowTop = floorY - baseOffset;
  const pad = 180; // 运动模糊外扩安全区

  // 齐整立正与回正控制 (SNAP)
  const inhale = ramp(frame, SNAP_FRAME - 2, 2, EASE.out);
  const snap = ramp(frame, SNAP_FRAME, SNAP_DUR, EASE.snappy);
  const snapRot = ramp(frame, SNAP_FRAME, SNAP_DUR + 2, EASE.overshoot);
  const pulse = 0.055 * inhale * (1 - snap);

  // 副标题浮现（立正一拍后平滑上浮）
  const subProg = ramp(frame, SNAP_FRAME + 3, 20, EASE.out);
  const subOpacity = subProg;
  const subTranslateY = (1 - subProg) * 16;

  // 顶部与底部 HUD 装饰淡入
  const hudProg = ramp(frame, 2, 20, EASE.out);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: isDark ? '#080A0F' : '#F4F5F7',
        backgroundImage: bg,
        overflow: 'hidden',
        fontFamily:
          '"Alibaba PuHuiTi", -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        userSelect: 'none',
      }}
    >
      {/* 1. 环境光影与暗角 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: groundGlow,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isDark
            ? 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.55) 100%)'
            : 'radial-gradient(circle at 50% 35%, rgba(255,255,255,0.85) 0%, rgba(20,22,31,0.08) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* 2. 顶部 HUD 技术信息栏 */}
      <div
        style={{
          position: 'absolute',
          top: 48,
          left: 80,
          right: 80,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 13,
          letterSpacing: '0.12em',
          fontWeight: 700,
          color: hudDim,
          opacity: hudProg,
          borderBottom: `1px solid ${hairlineColor}`,
          paddingBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: accentColor,
              boxShadow: `0 0 10px ${accentColor}`,
            }}
          />
          <span style={{ color: mainInk, letterSpacing: '0.16em' }}>
            {category}
          </span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span style={{ fontFamily: 'monospace' }}>
            FPS: 30 / DUR: {TYPE_ENTRANCE_MOVES_DURATION}F
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: 'monospace', color: accentColor }}>
            g = 9.806 m/s²
          </span>
          <span style={{ opacity: 0.5 }}>//</span>
          <span>{tagline}</span>
        </div>
      </div>

      {/* 3. 地平线与台面物理投影 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: floorY,
          bottom: 0,
          background: isDark
            ? 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.8) 100%)'
            : 'linear-gradient(180deg, rgba(20,22,31,0.04) 0%, rgba(20,22,31,0.015) 50%, transparent 100%)',
        }}
      />
      {/* 发丝地平线 */}
      <div
        style={{
          position: 'absolute',
          left: 80,
          right: 80,
          top: floorY,
          height: 1,
          background: isDark
            ? `linear-gradient(90deg, transparent 0%, ${hairlineColor} 20%, ${accentColor}66 50%, ${hairlineColor} 80%, transparent 100%)`
            : `linear-gradient(90deg, transparent 0%, ${hairlineColor} 20%, ${accentColor}88 50%, ${hairlineColor} 80%, transparent 100%)`,
        }}
      />
      {/* 地面坐标标尺点 */}
      <div
        style={{
          position: 'absolute',
          top: floorY + 8,
          left: 84,
          fontSize: 10,
          fontFamily: 'monospace',
          color: hudDim,
          letterSpacing: '0.1em',
        }}
      >
        Y_AXIS_DATUM: {floorY}PX
      </div>

      {/* 4. 核心字行：按自然槽位排布，逐字物理独立坠落 */}
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
          letterSpacing: '0.02em',
          color: mainInk,
        }}
      >
        {charArray.map((ch, i) => {
          const t = frame - startOf(i, charCount);
          const y = dropY(t);
          // 速度差分（px / frame）
          const vy = dropY(t + 0.5) - dropY(t - 0.5);
          const air = -y; // 离地距离

          // 随机歪斜角度（落地前为 0，落地瞬间歪斜，立正一拍齐整归位）
          const tiltSeed = (hash(i * 13 + 5) - 0.5) * 12; // ±6 度之间
          const landProg = EASE.out(clamp01((t - T_FALL) / 6));
          const rot = tiltSeed * landProg * (1 - snapRot);

          // 歪脚贴地修正：单侧歪斜导致重心下探，往上微调抬升保证底角刚好贴在地面线上
          const jitter = -Math.sin((Math.abs(rot) * Math.PI) / 180) * (fontSize * 0.28);

          // 速度拉伸 + 触地挤压弹性 (Squash & Stretch)
          const stretch =
            Math.min(1, Math.abs(vy) / 60) * 0.12 * (t < T_FALL ? 1 : 0.5);
          const sq = squashAt(t);
          const sy = (1 + stretch) * (1 - 0.22 * sq) + pulse;
          const sx = (1 - stretch * 0.55) * (1 + 0.16 * sq) + pulse;

          // 动态接触投影：贴地时浓郁锐利，悬空时大而虚淡
          const lift = clamp01(air / 450);
          const shadowOpacity =
            (t < 0 ? 0 : isDark ? 0.45 : 0.26) *
            (1 - lift * 0.88) *
            clamp01((t + 2) / 8);
          const shadowScaleX = mix(0.72, 1.4, lift) * (1 + 0.15 * Math.max(0, sq));
          const shadowBlur = mix(6, 32, lift);

          return (
            <span
              key={i}
              style={{
                position: 'relative',
                display: 'inline-block',
                margin: '0 4px',
              }}
            >
              {/* 布局占位：撑出字体真实字宽 */}
              <span style={{ visibility: 'hidden' }}>{ch}</span>

              {/* 物理接触影 */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: baseOffset - 6,
                  width: '90%',
                  height: 14,
                  transform: `translateX(-50%) scaleX(${shadowScaleX.toFixed(3)})`,
                  borderRadius: '50%',
                  backgroundColor: isDark ? '#000000' : 'rgba(15, 17, 24, 0.9)',
                  opacity: shadowOpacity,
                  filter: `blur(${shadowBlur.toFixed(1)}px)`,
                  pointerEvents: 'none',
                }}
              />

              {/* 运动层：位移 + 纵向运动模糊 + 歪角旋转 */}
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
                <SpeedBlurVertical
                  vy={vy}
                  amount={t < T_FALL ? 0.26 : 0.12}
                  max={16}
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
                      transformOrigin: '50% 88%',
                      textShadow: isDark
                        ? `0 4px 30px rgba(0,0,0,0.8), 0 0 20px ${accentColor}22`
                        : '0 4px 20px rgba(0,0,0,0.1)',
                    }}
                  >
                    {ch}
                  </div>
                </SpeedBlurVertical>
              </div>
            </span>
          );
        })}
      </div>

      {/* 5. 副标题区域：立正一拍后随之浮现 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: floorY + 68,
          textAlign: 'center',
          opacity: subOpacity,
          transform: `translateY(${subTranslateY.toFixed(2)}px)`,
        }}
      >
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: subInk,
            letterSpacing: '0.06em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <span
            style={{
              width: 32,
              height: 2,
              backgroundColor: accentColor,
              borderRadius: 1,
            }}
          />
          <span>{subtitle}</span>
          <span
            style={{
              width: 32,
              height: 2,
              backgroundColor: accentColor,
              borderRadius: 1,
            }}
          />
        </div>
      </div>

      {/* 6. 底部微量技术角标 */}
      <div
        style={{
          position: 'absolute',
          bottom: 36,
          left: 80,
          right: 80,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 12,
          fontFamily: 'monospace',
          color: hudDim,
          opacity: hudProg,
        }}
      >
        <div>SYSTEM STATUS: SETTLED // LOCK AT F116</div>
        <div>ALIBABA PUHUITI 3.0 · DAMPED KINETICS</div>
      </div>

      {/* 7. 质感胶片微噪点 */}
      <GrainOverlay opacity={isDark ? 0.08 : 0.05} dark={isDark} />

      {/* 8. 声音设计与单帧对齐 (逐字砸地声 + 回正 Snap 音) */}
      {enableAudio && (
        <>
          {/* 每个字符第一次触地撞击瞬间 (精确在 startOf(i) + T_FALL) */}
          {charArray.map((_, i) => {
            const impactFrame = Math.round(startOf(i, charCount) + T_FALL);
            return (
              <Sequence
                key={`sfx-pop-${i}`}
                from={impactFrame}
                durationInFrames={12}
              >
                <Audio
                  src={staticFile('audio/sfx/pop.mp3')}
                  volume={0.32 + 0.04 * (i % 3)}
                  playbackRate={0.95 + 0.06 * (i % 4)}
                />
              </Sequence>
            );
          })}

          {/* 立正前夕微弱疾风预备 (frame 104) */}
          <Sequence from={SNAP_FRAME - 6} durationInFrames={18}>
            <Audio
              src={staticFile('audio/sfx/whoosh-fast.mp3')}
              volume={0.22}
              playbackRate={1.3}
            />
          </Sequence>

          {/* 帧 110 全体齐整立正一拍 (Snap 顿挫重音) */}
          <Sequence from={SNAP_FRAME} durationInFrames={30}>
            <Audio
              src={staticFile('audio/sfx/transition-snap.mp3')}
              volume={0.65}
            />
          </Sequence>
        </>
      )}
    </AbsoluteFill>
  );
};
