import React, { useEffect } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { ensureFontsLoaded } from "../../src/styles/loadFonts";

export const DYNAMIC_ISLAND_FPS = 60;
export const DYNAMIC_ISLAND_DURATION = 300; // 5.0s @ 60fps

export interface DynamicIslandProps {
  /** 主标题粗体部分，例如 "iPhone" */
  titleBold: string;
  /** 主标题发光细体部分，例如 "Air" */
  titleLight: string;
  /** 副标题，例如 "（ 1 TB 最高配置 ）" */
  subtitle: string;
  /** 底部大数字 */
  metricValue: string;
  /** 是否显示左侧双点冒号 */
  showColonDots: boolean;
  /** 霓虹流光主色 (十六进制) */
  accentColor: string;
  /** 是否透明背景（方便剪辑叠在口播/实拍画面上） */
  transparentBackground: boolean;
  /** 末尾是否收拢回胶囊形态 */
  collapseAtEnd: boolean;
}

export const defaultDynamicIslandProps: DynamicIslandProps = {
  titleBold: "iPhone",
  titleLight: "Air",
  subtitle: "（ 1 TB 最高配置 ）",
  metricValue: "1",
  showColonDots: true,
  accentColor: "#58b4ff",
  transparentBackground: false,
  collapseAtEnd: true,
};

/**
 * 暗黑点阵科技背景 + 右侧冷蓝环境光 + 左侧细光束
 */
export const TechBackdrop: React.FC<{
  frame: number;
  accentColor: string;
  cardLeftX: number;
  cardTopY: number;
  beamProgress: number;
  glowBreath: number;
}> = ({ frame, accentColor, cardLeftX, cardTopY, beamProgress, glowBreath }) => {
  // 点阵网格极轻微呼吸
  const gridOpacity = interpolate(glowBreath, [0, 1], [0.22, 0.28]);

  // 左侧白光束从画外扫向卡片左侧上沿
  const beamWidth = interpolate(beamProgress, [0, 1], [0, Math.max(0, cardLeftX + 12)], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const beamOpacity = interpolate(frame, [0, 10, 240, 275], [0, 0.95, 0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0c10",
        overflow: "hidden",
      }}
    >
      {/* 极深暗角基底渐变 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 85% 80% at 50% 50%, #14171f 0%, #0b0d12 58%, #06070a 100%)",
        }}
      />

      {/* 右侧冷蓝环境辉光（还原参考图右侧微蓝氛围） */}
      <div
        style={{
          position: "absolute",
          right: -120,
          top: -80,
          width: 920,
          height: 1240,
          background: `radial-gradient(ellipse at 72% 45%, ${accentColor}30 0%, rgba(28, 78, 175, 0.14) 38%, transparent 72%)`,
          opacity: 0.78 + glowBreath * 0.22,
          filter: "blur(36px)",
        }}
      />

      {/* 底部托底氛围蓝光 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, 140px)",
          width: 960,
          height: 420,
          background: `radial-gradient(ellipse at 50% 45%, ${accentColor}26 0%, rgba(24, 72, 168, 0.08) 50%, transparent 75%)`,
          opacity: 0.65 + glowBreath * 0.35,
          filter: "blur(45px)",
        }}
      />

      {/* 精细点阵网格 (Dot Matrix) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(210, 224, 245, 0.65) 1.35px, transparent 1.35px)",
          backgroundSize: "26px 26px",
          opacity: gridOpacity,
          WebkitMaskImage:
            "radial-gradient(ellipse 72% 72% at 50% 52%, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.35) 68%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 72% 72% at 50% 52%, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.35) 68%, transparent 100%)",
        }}
      />

      {/* 左侧水平高光扫线（对应参考图左侧进入卡片的细白光） */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: cardTopY + 148,
          width: beamWidth,
          height: 3.5,
          opacity: beamOpacity,
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(200,225,255,0.45) 45%, rgba(255,255,255,0.98) 100%)",
          boxShadow:
            "0 0 12px rgba(255,255,255,0.85), 0 0 28px rgba(130,195,255,0.65)",
          borderRadius: 4,
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * SVG 底部冰蓝霓虹流光边框（解决 CSS border-radius 局部渐变发光断层问题）
 */
export const BottomNeonRim: React.FC<{
  width: number;
  height: number;
  radius: number;
  intensity: number;
  sweep: number;
  shimmerX: number;
  accentColor: string;
}> = ({ width, height, radius, intensity, sweep, shimmerX, accentColor }) => {
  const pad = 140; // 为宽幅外发光留足画布余量，彻底杜绝 SVG 边缘裁切
  const svgW = width + pad * 2;
  const svgH = height + pad * 2;

  return (
    <svg
      width={svgW}
      height={svgH}
      viewBox={`0 0 ${svgW} ${svgH}`}
      style={{
        position: "absolute",
        left: -pad,
        top: -pad,
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      <defs>
        {/* 纵向渐变：顶部透明 -> 下圆角渐亮 -> 底部边缘高亮电光冰蓝 */}
        <linearGradient id="di-rim-glow-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0" />
          <stop offset="66%" stopColor="#2c84ff" stopOpacity="0" />
          <stop offset="80%" stopColor="#3592ff" stopOpacity="0.45" />
          <stop offset="91%" stopColor="#68beff" stopOpacity="0.92" />
          <stop offset="97%" stopColor="#bfe6ff" stopOpacity="1" />
          <stop offset="100%" stopColor="#f2fbff" stopOpacity="1" />
        </linearGradient>

        {/* 核心锐利白蓝灯丝渐变 */}
        <linearGradient id="di-rim-core-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="76%" stopColor="#62bdff" stopOpacity="0" />
          <stop offset="88%" stopColor="#8ed2ff" stopOpacity="0.72" />
          <stop offset="96%" stopColor="#e6f7ff" stopOpacity="0.98" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
        </linearGradient>

        {/* 底边轻微游走的流光高亮点 */}
        <radialGradient
          id="di-rim-shimmer"
          cx={`${shimmerX}%`}
          cy="100%"
          r="28%"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#86d0ff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#4aa8ff" stopOpacity="0" />
        </radialGradient>

        {/* 宽幅柔和外辉光 */}
        <filter id="di-bloom-wide" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="18" />
        </filter>

        {/* 中层霓虹光晕 */}
        <filter id="di-bloom-mid" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>

        {/* 柔和羽化水平展开遮罩（大羽化过渡，彻底消除展开过程中的竖线裁切感） */}
        <linearGradient id="di-sweep-mask-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="black" />
          <stop offset={`${Math.max(0, 50 - sweep * 52)}%`} stopColor="black" />
          <stop offset={`${Math.max(0, 50 - sweep * 32)}%`} stopColor="white" />
          <stop offset={`${Math.min(100, 50 + sweep * 32)}%`} stopColor="white" />
          <stop offset={`${Math.min(100, 50 + sweep * 52)}%`} stopColor="black" />
          <stop offset="100%" stopColor="black" />
        </linearGradient>
        <mask id="di-rim-sweep-mask">
          <rect
            x={0}
            y={0}
            width={svgW}
            height={svgH}
            fill={sweep >= 0.99 ? "white" : "url(#di-sweep-mask-grad)"}
          />
        </mask>
      </defs>

      <g mask="url(#di-rim-sweep-mask)" opacity={intensity}>
        {/* Layer 1: 大范围电光蓝弥散外发光 */}
        <rect
          x={pad}
          y={pad}
          width={width}
          height={height}
          rx={radius}
          ry={radius}
          fill="none"
          stroke="url(#di-rim-glow-grad)"
          strokeWidth={22}
          filter="url(#di-bloom-wide)"
          opacity={0.85}
        />

        {/* Layer 2: 中层柔和光晕 */}
        <rect
          x={pad}
          y={pad}
          width={width}
          height={height}
          rx={radius}
          ry={radius}
          fill="none"
          stroke="url(#di-rim-glow-grad)"
          strokeWidth={7.5}
          filter="url(#di-bloom-mid)"
          opacity={0.95}
        />

        {/* Layer 3: 锐利白蓝灯丝核心 */}
        <rect
          x={pad}
          y={pad}
          width={width}
          height={height}
          rx={radius}
          ry={radius}
          fill="none"
          stroke="url(#di-rim-core-grad)"
          strokeWidth={3.2}
          opacity={1}
        />

        {/* Layer 4: 沿底边缓缓游走的高光点 */}
        <rect
          x={pad}
          y={pad}
          width={width}
          height={height}
          rx={radius}
          ry={radius}
          fill="none"
          stroke="url(#di-rim-shimmer)"
          strokeWidth={4.5}
          filter="url(#di-bloom-mid)"
          opacity={0.7}
        />
      </g>
    </svg>
  );
};

export const DynamicIsland: React.FC<DynamicIslandProps> = ({
  titleBold,
  titleLight,
  subtitle,
  metricValue,
  showColonDots,
  accentColor,
  transparentBackground,
  collapseAtEnd,
}) => {
  const frame = useCurrentFrame();
  const { fps, width: compW, height: compH } = useVideoConfig();

  useEffect(() => {
    void ensureFontsLoaded();
  }, []);

  // =========================================================================
  // 1. 灵动岛物理弹簧时间轴 (60fps, 共 300 帧 = 5.0s)
  // =========================================================================

  // Stage 1 (0 ~ 24f): 胶囊弹入唤醒
  const pillAppear = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: { damping: 16, stiffness: 180, mass: 0.7 },
  });

  // 左侧白光扫入
  const beamProgress = interpolate(frame, [2, 30], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Stage 2 (26 ~ 84f): 胶囊 -> 大圆角卡片液态展开（苹果风：宽比高略早一步撑开）
  const expandW = spring({
    frame: Math.max(0, frame - 26),
    fps,
    config: { damping: 14, stiffness: 115, mass: 0.92 },
  });
  const expandH = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 15, stiffness: 105, mass: 0.98 },
  });

  // Stage 5 (244 ~ 292f): 弹性收拢回胶囊（可选）
  const collapseProgress = collapseAtEnd
    ? spring({
        frame: Math.max(0, frame - 246),
        fps,
        config: { damping: 16, stiffness: 135, mass: 0.85 },
      })
    : 0;

  const morphW = Math.max(0, expandW - collapseProgress);
  const morphH = Math.max(0, expandH - collapseProgress);

  // 胶囊尺寸 -> 完整卡片尺寸（严格对标参考图 ~1.22:1 宽厚比例）
  const PILL_W = 220;
  const PILL_H = 64;
  const CARD_W = 790;
  const CARD_H = 648;

  const currentW = interpolate(morphW, [0, 1], [PILL_W, CARD_W]);
  const currentH = interpolate(morphH, [0, 1], [PILL_H, CARD_H]);
  const currentRadius = interpolate(
    Math.min(morphW, morphH),
    [0, 1],
    [PILL_H / 2, 92],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 胶囊入场缩放 & 退场轻微回缩
  const pillExitScale = collapseAtEnd
    ? interpolate(frame, [282, 298], [1, 0.88], {
        easing: Easing.in(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const pillExitOpacity = collapseAtEnd
    ? interpolate(frame, [284, 298], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  const islandScale = interpolate(pillAppear, [0, 1], [0.65, 1]) * pillExitScale;
  const islandOpacity =
    interpolate(frame, [4, 14], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * pillExitOpacity;

  // 展开过程中轻微上浮居中的呼吸位姿
  const floatY = Math.sin((frame / fps) * Math.PI * 0.9) * 3 * morphH;

  // =========================================================================
  // 2. 底部冰蓝流光点亮与呼吸
  // =========================================================================
  const rimSweepIn = interpolate(frame, [34, 76], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rimFadeOut = collapseAtEnd
    ? interpolate(frame, [234, 254], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  const glowBreath = 0.5 + 0.5 * Math.sin(((frame - 70) / fps) * Math.PI * 1.15);
  const rimIntensity =
    interpolate(frame, [34, 58], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) *
    (0.88 + glowBreath * 0.12) *
    rimFadeOut;

  // 流光亮点在底边 22% ~ 78% 缓慢游走
  const shimmerX = 50 + Math.sin(((frame - 60) / fps) * 1.4) * 28;

  // =========================================================================
  // 3. 卡片内部元素：iOS 灵动岛标志性「高斯模糊溶解 + 弹性缩放」错峰进场
  // =========================================================================
  const contentExit = collapseAtEnd
    ? interpolate(frame, [232, 248], [1, 0], {
        easing: Easing.in(Easing.quad),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const contentExitBlur = collapseAtEnd
    ? interpolate(frame, [232, 248], [0, 14], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // (a) 主标题 "iPhone Air"
  const titleIn = spring({
    frame: Math.max(0, frame - 46),
    fps,
    config: { damping: 18, stiffness: 130, mass: 0.8 },
  });
  const titleOpacity =
    interpolate(frame, [46, 62], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * contentExit;
  const titleBlur =
    interpolate(frame, [46, 66], [16, 0], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) + contentExitBlur;
  const titleY = interpolate(titleIn, [0, 1], [18, 0]);
  const titleScale = interpolate(titleIn, [0, 1], [0.92, 1]);

  // "Air" 柔和白光额外延迟 8 帧点亮，做出轻盈空气感
  const airGlowPower = interpolate(frame, [54, 78], [0.15, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // (b) 副标题 "（ 1 TB 最高配置 ）"
  const subIn = spring({
    frame: Math.max(0, frame - 56),
    fps,
    config: { damping: 18, stiffness: 120, mass: 0.85 },
  });
  const subOpacity =
    interpolate(frame, [56, 74], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * contentExit;
  const subBlur =
    interpolate(frame, [56, 74], [12, 0], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) + contentExitBlur;
  const subTracking = interpolate(subIn, [0, 1], [0.12, 0.24]);
  const subY = interpolate(subIn, [0, 1], [14, 0]);

  // (c) 底部核心指标区 ": 1"
  const metricIn = spring({
    frame: Math.max(0, frame - 66),
    fps,
    config: { damping: 14, stiffness: 140, mass: 0.85 },
  });
  const metricOpacity =
    interpolate(frame, [66, 82], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * contentExit;
  const metricBlur =
    interpolate(frame, [66, 84], [18, 0], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) + contentExitBlur;
  const metricScale = interpolate(metricIn, [0, 1], [0.76, 1]);
  const metricY = interpolate(metricIn, [0, 1], [32, 0]);

  // 左侧双点冒号轻轻呼吸
  const dotsPulse = 0.85 + 0.15 * Math.sin(((frame - 70) / fps) * Math.PI * 2);

  // 计算卡片左上角在画布中的位置，用于对齐左侧光束
  const cardLeftX = (compW - CARD_W) / 2;
  const cardTopY = (compH - CARD_H) / 2;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: transparentBackground ? "transparent" : "#0a0c10",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          '"SF Pro Display", "Alibaba PuHuiTi", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* 暗黑点阵科技背景 */}
      {!transparentBackground && (
        <TechBackdrop
          frame={frame}
          accentColor={accentColor}
          cardLeftX={cardLeftX}
          cardTopY={cardTopY}
          beamProgress={beamProgress}
          glowBreath={glowBreath}
        />
      )}

      {/* 灵动岛主体容器 */}
      <div
        style={{
          position: "relative",
          width: currentW,
          height: currentH,
          borderRadius: currentRadius,
          transform: `translateY(${floatY}px) scale(${islandScale})`,
          opacity: islandOpacity,
          // 外部柔和投影 + 底部蓝色环境反射
          boxShadow: `
            0 28px 80px rgba(0, 0, 0, 0.78),
            0 18px 56px rgba(56, 138, 255, ${0.28 * rimIntensity})
          `,
        }}
      >
        {/* 卡片内部（overflow: hidden 裁切内部蓝光和文字，保证圆角边缘极其干净） */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: currentRadius,
            backgroundColor: "#020306",
            overflow: "hidden",
            // 极微弱的顶部暗灰轮廓线，让纯黑卡片与暗黑背景自然分层
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* 卡片内部底端向上漫射的深蓝氛围内发光 */}
          <div
            style={{
              position: "absolute",
              left: "-12%",
              right: "-12%",
              bottom: -32,
              height: "56%",
              opacity: rimIntensity,
              background: `
                radial-gradient(ellipse 78% 76% at 50% 100%,
                  rgba(105, 185, 255, 0.52) 0%,
                  rgba(38, 108, 235, 0.36) 35%,
                  rgba(16, 48, 128, 0.18) 64%,
                  rgba(2, 3, 6, 0) 100%
                )
              `,
              pointerEvents: "none",
            }}
          />

          {/* 卡片顶部右侧极细微环境反光（呼应右侧蓝光） */}
          <div
            style={{
              position: "absolute",
              right: -60,
              top: -60,
              width: 340,
              height: 300,
              opacity: 0.22 * morphH,
              background:
                "radial-gradient(circle at 70% 30%, rgba(160, 200, 255, 0.22) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* 内容排版层（固定内部参照系居中，防止形变时换行抖动） */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: CARD_W,
              height: CARD_H,
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 12,
              paddingBottom: 24,
              boxSizing: "border-box",
            }}
          >
            {/* 第一行：iPhone Air */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "center",
                gap: 24,
                opacity: titleOpacity,
                filter: `blur(${titleBlur.toFixed(2)}px)`,
                transform: `translateY(${titleY}px) scale(${titleScale})`,
                marginBottom: 26,
              }}
            >
              <span
                style={{
                  fontSize: 84,
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.05,
                }}
              >
                {titleBold}
              </span>
              <span
                style={{
                  fontFamily:
                    '"Segoe UI Light", "Helvetica Neue", "PingFang SC", "Alibaba PuHuiTi", sans-serif',
                  fontSize: 94,
                  fontWeight: 200,
                  color: "#ffffff",
                  letterSpacing: "0.015em",
                  lineHeight: 1.05,
                  textShadow: `
                    0 0 ${16 * airGlowPower}px rgba(255, 255, 255, ${0.9 * airGlowPower}),
                    0 0 ${38 * airGlowPower}px rgba(205, 230, 255, ${0.6 * airGlowPower}),
                    0 0 ${68 * airGlowPower}px rgba(130, 185, 255, ${0.36 * airGlowPower})
                  `,
                }}
              >
                {titleLight}
              </span>
            </div>

            {/* 第二行：（ 1 TB 最高配置 ） */}
            <div
              style={{
                fontSize: 32,
                fontWeight: 400,
                color: "rgba(232, 240, 252, 0.88)",
                letterSpacing: `${subTracking}em`,
                paddingLeft: `${subTracking}em`,
                opacity: subOpacity,
                filter: `blur(${subBlur.toFixed(2)}px)`,
                transform: `translateY(${subY}px)`,
                marginBottom: 46,
                whiteSpace: "nowrap",
              }}
            >
              {subtitle}
            </div>

            {/* 第三行：左侧双点冒号 + 居中超大粗体数字 "1" */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: 210,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: metricOpacity,
                filter: `blur(${metricBlur.toFixed(2)}px)`,
                transform: `translateY(${metricY}px) scale(${metricScale})`,
              }}
            >
              {showColonDots && (
                <div
                  style={{
                    position: "absolute",
                    left: 175,
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 32,
                    opacity: dotsPulse,
                  }}
                >
                  <div
                    style={{
                      width: 17,
                      height: 17,
                      borderRadius: "50%",
                      backgroundColor: "#ffffff",
                      boxShadow: "0 0 12px rgba(255, 255, 255, 0.45)",
                    }}
                  />
                  <div
                    style={{
                      width: 17,
                      height: 17,
                      borderRadius: "50%",
                      backgroundColor: "#ffffff",
                      boxShadow: "0 0 12px rgba(255, 255, 255, 0.45)",
                    }}
                  />
                </div>
              )}

              <div
                style={{
                  fontSize: 214,
                  fontWeight: 800,
                  color: "#ffffff",
                  lineHeight: 0.95,
                  letterSpacing: "-0.03em",
                  textShadow: "0 8px 30px rgba(0, 0, 0, 0.45)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {metricValue}
              </div>
            </div>
          </div>
        </div>

        {/* SVG 底部冰蓝霓虹流光边框 */}
        <BottomNeonRim
          width={currentW}
          height={currentH}
          radius={currentRadius}
          intensity={rimIntensity}
          sweep={rimSweepIn}
          shimmerX={shimmerX}
          accentColor={accentColor}
        />
      </div>
    </AbsoluteFill>
  );
};
