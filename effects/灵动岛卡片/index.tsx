import React, { useEffect } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ensureFontsLoaded } from "../../src/styles/loadFonts";

/**
 * 灵动岛卡片 (Dynamic Island Talking-Head Overlay Card)
 *
 * 专为人物口播视频原生叠加设计的 Remotion 动效组件：
 * - 原生透明底（无绿幕抠像溢色，底部电光冰蓝外发光自然融于实拍人像背景）
 * - 自适应任意 fps（30 / 60fps）与任意 <Sequence durationInFrames={...}> 时长
 * - 苹果液态弹簧变形（胶囊 ↔ 修长横条卡片）+ 高斯模糊溶解显影 + 核心数字冲刺计数
 * - 支持一键配置位置（center / bottom / top / lower-left / lower-right）、缩放、卡片尺寸与流光主题色
 */

export const LINGDONGDAO_DEFAULT_FPS = 60;
export const LINGDONGDAO_DEFAULT_DURATION = 240; // 4.0s @ 60fps

export type IslandCardPosition =
  | "center"
  | "bottom"
  | "top"
  | "lower-left"
  | "lower-right";

export interface LingDongDaoCardProps {
  /** 左侧引导文案，例如 "实测"（可留空） */
  leftText?: string;
  /** 核心放大高亮数字，例如 108 或 1.5（与 highlightText 二选一） */
  highlightNumber?: number;
  /** 小数位数（仅 highlightNumber 生效，默认自动推断） */
  decimals?: number;
  /** 是否开启 0 -> highlightNumber 冲刺计数动效（默认 true） */
  countUp?: boolean;
  /** 若不需要数字，可直接传纯文字高亮（优先级高于 highlightNumber） */
  highlightText?: string;
  /** 高亮数字右侧小单位，例如 "台" / "Mbps" / "小时" */
  unitText?: string;
  /** 右侧主词粗体部分，例如 "随身" */
  rightBoldText?: string;
  /** 右侧主词发光细体部分，例如 "WiFi" / "Air" */
  rightLightText?: string;
  /** 卡片宽 (px)，默认 1120 */
  cardWidth?: number;
  /** 卡片高 (px)，默认 276 */
  cardHeight?: number;
  /** 圆角半径 (px)，默认 64 */
  borderRadius?: number;
  /** 底部电光流光主题色（默认冰蓝 #58b4ff） */
  accentColor?: string;
  /** 在口播画面中的摆放位置（默认 bottom，贴合人像中下方不遮脸） */
  position?: IslandCardPosition;
  /** 整体缩放比例（默认 1） */
  scale?: number;
  /** 额外水平微调偏移 (px) */
  offsetX?: number;
  /** 额外垂直微调偏移 (px) */
  offsetY?: number;
  /** 末尾是否弹性收拢回胶囊退场（默认 true） */
  collapseAtEnd?: boolean;
  /** 仅在 Studio 预览时显示暗黑点阵背景；叠在口播视频上请保持 false */
  previewBackground?: boolean;
}

export const defaultLingDongDaoProps: LingDongDaoCardProps = {
  leftText: "实测",
  highlightNumber: 108,
  countUp: true,
  unitText: "台",
  rightBoldText: "随身",
  rightLightText: "WiFi",
  cardWidth: 1120,
  cardHeight: 276,
  borderRadius: 64,
  accentColor: "#58b4ff",
  position: "bottom",
  scale: 0.88,
  offsetX: 0,
  offsetY: 0,
  collapseAtEnd: true,
  previewBackground: false,
};

/**
 * 内部 SVG 底部霓虹流光边框（pad=140px，杜绝任何宽幅外发光裁切）
 */
const NeonBottomRim: React.FC<{
  idPrefix: string;
  width: number;
  height: number;
  radius: number;
  intensity: number;
  sweep: number;
  shimmerX: number;
  accentColor: string;
}> = ({
  idPrefix,
  width,
  height,
  radius,
  intensity,
  sweep,
  shimmerX,
  accentColor,
}) => {
  const pad = 140;
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
        <linearGradient id={`${idPrefix}-glow`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0" />
          <stop offset="66%" stopColor={accentColor} stopOpacity="0" />
          <stop offset="80%" stopColor={accentColor} stopOpacity="0.48" />
          <stop offset="91%" stopColor={accentColor} stopOpacity="0.92" />
          <stop offset="97%" stopColor="#d6f0ff" stopOpacity="1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
        </linearGradient>

        <linearGradient id={`${idPrefix}-core`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="76%" stopColor={accentColor} stopOpacity="0" />
          <stop offset="88%" stopColor="#a8ddff" stopOpacity="0.72" />
          <stop offset="96%" stopColor="#eef9ff" stopOpacity="0.98" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
        </linearGradient>

        <radialGradient
          id={`${idPrefix}-shimmer`}
          cx={`${shimmerX}%`}
          cy="100%"
          r="28%"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="45%" stopColor={accentColor} stopOpacity="0.45" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
        </radialGradient>

        <filter
          id={`${idPrefix}-bloom-wide`}
          x="-60%"
          y="-60%"
          width="220%"
          height="220%"
        >
          <feGaussianBlur stdDeviation="18" />
        </filter>

        <filter
          id={`${idPrefix}-bloom-mid`}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur stdDeviation="6" />
        </filter>

        <linearGradient
          id={`${idPrefix}-sweep-grad`}
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <stop offset="0%" stopColor="black" />
          <stop offset={`${Math.max(0, 50 - sweep * 52)}%`} stopColor="black" />
          <stop offset={`${Math.max(0, 50 - sweep * 32)}%`} stopColor="white" />
          <stop
            offset={`${Math.min(100, 50 + sweep * 32)}%`}
            stopColor="white"
          />
          <stop
            offset={`${Math.min(100, 50 + sweep * 52)}%`}
            stopColor="black"
          />
          <stop offset="100%" stopColor="black" />
        </linearGradient>

        <mask id={`${idPrefix}-sweep-mask`}>
          <rect
            x={0}
            y={0}
            width={svgW}
            height={svgH}
            fill={sweep >= 0.99 ? "white" : `url(#${idPrefix}-sweep-grad)`}
          />
        </mask>
      </defs>

      <g mask={`url(#${idPrefix}-sweep-mask)`} opacity={intensity}>
        <rect
          x={pad}
          y={pad}
          width={width}
          height={height}
          rx={radius}
          ry={radius}
          fill="none"
          stroke={`url(#${idPrefix}-glow)`}
          strokeWidth={22}
          filter={`url(#${idPrefix}-bloom-wide)`}
          opacity={0.85}
        />
        <rect
          x={pad}
          y={pad}
          width={width}
          height={height}
          rx={radius}
          ry={radius}
          fill="none"
          stroke={`url(#${idPrefix}-glow)`}
          strokeWidth={7.5}
          filter={`url(#${idPrefix}-bloom-mid)`}
          opacity={0.95}
        />
        <rect
          x={pad}
          y={pad}
          width={width}
          height={height}
          rx={radius}
          ry={radius}
          fill="none"
          stroke={`url(#${idPrefix}-core)`}
          strokeWidth={3.2}
          opacity={1}
        />
        <rect
          x={pad}
          y={pad}
          width={width}
          height={height}
          rx={radius}
          ry={radius}
          fill="none"
          stroke={`url(#${idPrefix}-shimmer)`}
          strokeWidth={4.5}
          filter={`url(#${idPrefix}-bloom-mid)`}
          opacity={0.7}
        />
      </g>
    </svg>
  );
};

function getPositionStyle(
  position: IslandCardPosition
): React.CSSProperties {
  switch (position) {
    case "bottom":
      return {
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: 96,
      };
    case "top":
      return {
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: 96,
      };
    case "lower-left":
      return {
        alignItems: "flex-end",
        justifyContent: "flex-start",
        paddingBottom: 96,
        paddingLeft: 100,
      };
    case "lower-right":
      return {
        alignItems: "flex-end",
        justifyContent: "flex-end",
        paddingBottom: 96,
        paddingRight: 100,
      };
    case "center":
    default:
      return {
        alignItems: "center",
        justifyContent: "center",
      };
  }
}

export const 灵动岛卡片: React.FC<LingDongDaoCardProps> = ({
  leftText = "实测",
  highlightNumber = 108,
  decimals,
  countUp = true,
  highlightText,
  unitText = "台",
  rightBoldText = "随身",
  rightLightText = "WiFi",
  cardWidth = 1120,
  cardHeight = 276,
  borderRadius = 64,
  accentColor = "#58b4ff",
  position = "bottom",
  scale = 0.88,
  offsetX = 0,
  offsetY = 0,
  collapseAtEnd = true,
  previewBackground = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  useEffect(() => {
    void ensureFontsLoaded();
  }, []);

  // 按秒换算关键帧，确保 30fps / 60fps 与任意 Sequence 时长完全一致
  const sec = (s: number) => Math.round(s * fps);
  const totalSec = durationInFrames / fps;
  const exitStartSec = Math.max(1.8, totalSec - 0.9);
  const exitStartF = sec(exitStartSec);

  const PILL_W = 210;
  const PILL_H = 62;

  // 1. 胶囊唤醒 + 液态弹簧展开 + 末尾弹性收拢
  const pillAppear = spring({
    frame: Math.max(0, frame - sec(0.06)),
    fps,
    config: { damping: 16, stiffness: 185, mass: 0.7 },
  });

  const expandW = spring({
    frame: Math.max(0, frame - sec(0.36)),
    fps,
    config: { damping: 14, stiffness: 118, mass: 0.88 },
  });
  const expandH = spring({
    frame: Math.max(0, frame - sec(0.42)),
    fps,
    config: { damping: 15, stiffness: 112, mass: 0.92 },
  });

  const collapseProgress = collapseAtEnd
    ? spring({
        frame: Math.max(0, frame - exitStartF),
        fps,
        config: { damping: 16, stiffness: 135, mass: 0.85 },
      })
    : 0;

  const morphW = Math.max(0, expandW - collapseProgress);
  const morphH = Math.max(0, expandH - collapseProgress);

  const currentW = interpolate(morphW, [0, 1], [PILL_W, cardWidth]);
  const currentH = interpolate(morphH, [0, 1], [PILL_H, cardHeight]);
  const currentRadius = interpolate(
    Math.min(morphW, morphH),
    [0, 1],
    [PILL_H / 2, borderRadius],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const exitFadeStart = sec(totalSec - 0.28);
  const exitFadeEnd = Math.max(exitFadeStart + 2, durationInFrames - 2);
  const pillExitScale = collapseAtEnd
    ? interpolate(frame, [exitFadeStart, exitFadeEnd], [1, 0.86], {
        easing: Easing.in(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const pillExitOpacity = collapseAtEnd
    ? interpolate(frame, [exitFadeStart, exitFadeEnd], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  const islandScale =
    interpolate(pillAppear, [0, 1], [0.65, 1]) * pillExitScale * scale;
  const islandOpacity =
    interpolate(frame, [sec(0.06), sec(0.22)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * pillExitOpacity;

  const floatY = Math.sin((frame / fps) * Math.PI * 0.9) * 2.5 * morphH;

  // 2. 底部电光流光控制
  const rimSweepIn = interpolate(frame, [sec(0.46), sec(1.15)], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rimFadeOut = collapseAtEnd
    ? interpolate(frame, [exitStartF - sec(0.18), exitStartF + sec(0.12)], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  const glowBreath =
    0.5 + 0.5 * Math.sin(((frame - sec(1.1)) / fps) * Math.PI * 1.15);
  const rimIntensity =
    interpolate(frame, [sec(0.46), sec(0.86)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) *
    (0.88 + glowBreath * 0.12) *
    rimFadeOut;

  const shimmerX = 50 + Math.sin(((frame - sec(1.0)) / fps) * 1.45) * 34;

  // 3. 内容错峰高斯模糊溶解显影 + 核心数字冲刺计数
  const contentExit = collapseAtEnd
    ? interpolate(frame, [exitStartF - sec(0.22), exitStartF + sec(0.04)], [1, 0], {
        easing: Easing.in(Easing.quad),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const contentExitBlur = collapseAtEnd
    ? interpolate(
        frame,
        [exitStartF - sec(0.22), exitStartF + sec(0.04)],
        [0, 14],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }
      )
    : 0;

  // 左侧文案
  const leftIn = spring({
    frame: Math.max(0, frame - sec(0.66)),
    fps,
    config: { damping: 18, stiffness: 135, mass: 0.8 },
  });
  const leftOpacity =
    interpolate(frame, [sec(0.66), sec(0.92)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * contentExit;
  const leftBlur =
    interpolate(frame, [sec(0.66), sec(0.96)], [14, 0], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) + contentExitBlur;
  const leftX = interpolate(leftIn, [0, 1], [-18, 0]);

  // 核心高亮数字/词
  const numIn = spring({
    frame: Math.max(0, frame - sec(0.76)),
    fps,
    config: { damping: 13, stiffness: 135, mass: 0.88 },
  });
  const numOpacity =
    interpolate(frame, [sec(0.76), sec(0.98)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * contentExit;
  const numBlur =
    interpolate(frame, [sec(0.76), sec(1.06)], [18, 0], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) + contentExitBlur;

  const countProgress = countUp
    ? interpolate(frame, [sec(0.76), sec(1.46)], [0, 1], {
        easing: Easing.out(Easing.exp),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  const resolvedDecimals =
    decimals !== undefined
      ? decimals
      : String(highlightNumber).includes(".")
        ? String(highlightNumber).split(".")[1].length
        : 0;

  const formattedHighlight =
    highlightText !== undefined
      ? highlightText
      : (highlightNumber * countProgress).toFixed(resolvedDecimals);

  const numLandingPulse = interpolate(
    frame,
    [sec(1.4), sec(1.5), sec(1.76)],
    [0, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const numScale =
    interpolate(numIn, [0, 1], [0.76, 1]) * (1 + numLandingPulse * 0.05);

  const unitOpacity =
    interpolate(frame, [sec(0.96), sec(1.2)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * contentExit;

  // 右侧粗细组合词
  const rightIn = spring({
    frame: Math.max(0, frame - sec(0.9)),
    fps,
    config: { damping: 17, stiffness: 128, mass: 0.84 },
  });
  const rightOpacity =
    interpolate(frame, [sec(0.9), sec(1.16)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * contentExit;
  const rightBlur =
    interpolate(frame, [sec(0.9), sec(1.2)], [14, 0], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) + contentExitBlur;
  const rightX = interpolate(rightIn, [0, 1], [20, 0]);

  const lightGlowPower = interpolate(frame, [sec(1.06), sec(1.46)], [0.2, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const uniqueSvgId = `ldd-${Math.round(cardWidth)}-${Math.round(cardHeight)}`;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: previewBackground ? "#0a0c10" : "transparent",
        display: "flex",
        pointerEvents: "none",
        fontFamily:
          '"SF Pro Display", "Alibaba PuHuiTi", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        ...getPositionStyle(position),
      }}
    >
      {/* 仅预览模式下的暗黑点阵底板 */}
      {previewBackground && (
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse 85% 80% at 50% 50%, #14171f 0%, #0b0d12 58%, #06070a 100%)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(rgba(210, 224, 245, 0.65) 1.35px, transparent 1.35px)",
              backgroundSize: "26px 26px",
              opacity: 0.24,
            }}
          />
        </AbsoluteFill>
      )}

      {/* 灵动岛主体容器 */}
      <div
        style={{
          position: "relative",
          width: currentW,
          height: currentH,
          borderRadius: currentRadius,
          transform: `translate(${offsetX}px, ${offsetY + floatY}px) scale(${islandScale})`,
          opacity: islandOpacity,
          boxShadow: `
            0 24px 68px rgba(0, 0, 0, 0.72),
            0 18px 54px ${accentColor}${Math.round(rimIntensity * 82)
              .toString(16)
              .padStart(2, "0")}
          `,
        }}
      >
        {/* 卡片内部 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: currentRadius,
            backgroundColor: "#020306",
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* 底部向上漫射氛围内发光 */}
          <div
            style={{
              position: "absolute",
              left: "-10%",
              right: "-10%",
              bottom: -24,
              height: "68%",
              opacity: rimIntensity,
              background: `
                radial-gradient(ellipse 72% 82% at 50% 100%,
                  ${accentColor}7a 0%,
                  ${accentColor}48 38%,
                  ${accentColor}22 68%,
                  rgba(2, 3, 6, 0) 100%
                )
              `,
              pointerEvents: "none",
            }}
          />

          {/* 顶部右侧极轻微玻璃反光 */}
          <div
            style={{
              position: "absolute",
              right: -40,
              top: -50,
              width: 320,
              height: 200,
              opacity: 0.2 * morphH,
              background:
                "radial-gradient(circle at 70% 30%, rgba(160, 200, 255, 0.22) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* 固定内部横排居中参照系 */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: cardWidth,
              height: cardHeight,
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: 10,
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "baseline",
                justifyContent: "center",
                whiteSpace: "nowrap",
              }}
            >
              {leftText && (
                <div
                  style={{
                    fontSize: 56,
                    fontWeight: 500,
                    color: "rgba(236, 244, 255, 0.92)",
                    letterSpacing: "0.14em",
                    marginRight: 30,
                    opacity: leftOpacity,
                    filter: `blur(${leftBlur.toFixed(2)}px)`,
                    transform: `translateX(${leftX}px)`,
                  }}
                >
                  {leftText}
                </div>
              )}

              {/* 核心高亮区 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  marginRight: rightBoldText || rightLightText ? 30 : 0,
                  opacity: numOpacity,
                  filter: `blur(${numBlur.toFixed(2)}px)`,
                  transform: `scale(${numScale})`,
                  transformOrigin: "center bottom",
                }}
              >
                <span
                  style={{
                    fontSize: 162,
                    fontWeight: 900,
                    color: "#ffffff",
                    lineHeight: 0.9,
                    letterSpacing: "-0.04em",
                    fontVariantNumeric: "tabular-nums",
                    textShadow: `
                      0 0 ${24 + numLandingPulse * 28}px rgba(135, 205, 255, ${0.46 + numLandingPulse * 0.45}),
                      0 0 ${58 + numLandingPulse * 42}px rgba(68, 150, 255, ${0.26 + numLandingPulse * 0.35})
                    `,
                  }}
                >
                  {formattedHighlight}
                </span>
                {unitText && (
                  <span
                    style={{
                      fontSize: 44,
                      fontWeight: 400,
                      color: "rgba(218, 234, 255, 0.88)",
                      marginLeft: 10,
                      opacity: unitOpacity,
                      textShadow: "0 0 14px rgba(145, 205, 255, 0.45)",
                    }}
                  >
                    {unitText}
                  </span>
                )}
              </div>

              {/* 右侧粗细发光组合词 */}
              {(rightBoldText || rightLightText) && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 14,
                    opacity: rightOpacity,
                    filter: `blur(${rightBlur.toFixed(2)}px)`,
                    transform: `translateX(${rightX}px)`,
                  }}
                >
                  {rightBoldText && (
                    <span
                      style={{
                        fontSize: 60,
                        fontWeight: 700,
                        color: "#ffffff",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {rightBoldText}
                    </span>
                  )}
                  {rightLightText && (
                    <span
                      style={{
                        fontFamily:
                          '"Segoe UI Light", "Helvetica Neue", "PingFang SC", "Alibaba PuHuiTi", sans-serif',
                        fontSize: 66,
                        fontWeight: 200,
                        color: "#ffffff",
                        letterSpacing: "0.02em",
                        textShadow: `
                          0 0 ${16 * lightGlowPower}px rgba(255, 255, 255, ${0.9 * lightGlowPower}),
                          0 0 ${36 * lightGlowPower}px rgba(195, 228, 255, ${0.62 * lightGlowPower}),
                          0 0 ${64 * lightGlowPower}px rgba(120, 182, 255, ${0.38 * lightGlowPower})
                        `,
                      }}
                    >
                      {rightLightText}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SVG 底部电光霓虹流光边 */}
        <NeonBottomRim
          idPrefix={uniqueSvgId}
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

// 英文别名，方便跨模块引用
export const DynamicIslandCard = 灵动岛卡片;
export default 灵动岛卡片;
