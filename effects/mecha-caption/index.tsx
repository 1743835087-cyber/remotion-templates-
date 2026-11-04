import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig, Interactive, Solid,
} from "remotion";
import { ensureFontsLoaded } from "../../src/styles/loadFonts";

/**
 * 机甲斜切风口播文字卡片 (Mecha Caption)
 * - 透明背景，可直接叠加到口播视频上（导出 ProRes 4444 / PNG 序列）
 * - 入场：底部括号展开 → 铭牌擦入 → 标签落下 → 逐字弹出 + 数字滚动
 * - 驻留：扫光 + 强调色呼吸
 * - 出场：最后 16 帧自动擦除退场（时长由 Composition 的 durationInFrames 决定）
 */

export const MECHA_CAPTION_DURATION = 120; // 4s @ 30fps

export interface CaptionSegment {
  text: string;
  /** 使用强调色 */
  accent?: boolean;
  /** 数字滚动（text 需为数字，如 "1.5" / "850"） */
  countUp?: boolean;
}

export type CaptionIcon = "battery" | "signal" | "bolt" | "thermo" | "none";

export interface MechaCaptionProps {
  /** 左上角英文标签 */
  tag: string;
  /** 主标题分段（可混合白字 / 强调色 / 数字滚动） */
  segments: CaptionSegment[];
  /** 副标题（可留空） */
  subText?: string;
  accentColor: string;
  icon?: CaptionIcon;
  position?: "center" | "bottom" | "lower-left";
  scale?: number;
  /** 仅用于预览的深色背景；导出透明素材时设为 false */
  previewBackground?: boolean;
}

export const defaultMechaCaptionProps: MechaCaptionProps = {
  tag: "BATTERY LIFE",
  segments: [
    { text: "实测续航" },
    { text: "1.5", accent: true, countUp: true },
    { text: "天", accent: true },
  ],
  subText: "重度使用 · 5G 全程在线",
  accentColor: "#63C93E",
  icon: "battery",
  position: "center",
  scale: 1,
  previewBackground: false,
};

export const speedCaptionProps: MechaCaptionProps = {
  tag: "PEAK SPEED",
  segments: [
    { text: "峰值网速" },
    { text: "850", accent: true, countUp: true },
    { text: "Mbps", accent: true },
  ],
  subText: "RedCap 5G · 室内实测",
  accentColor: "#3D80D9",
  icon: "signal",
  position: "center",
  scale: 1,
  previewBackground: false,
};

export const thermalCaptionProps: MechaCaptionProps = {
  tag: "THERMAL",
  segments: [
    { text: "满载机身仅" },
    { text: "38", accent: true, countUp: true },
    { text: "℃", accent: true },
  ],
  subText: "连续下载 1 小时",
  accentColor: "#40B5BC",
  icon: "thermo",
  position: "center",
  scale: 1,
  previewBackground: false,
};

// ------------------------------------------------------------------
// Icons
// ------------------------------------------------------------------
const CaptionIconSvg: React.FC<{
  type: CaptionIcon;
  color: string;
  progress: number;
  frame: number;
}> = ({ type, color, progress, frame }) => {
  const stroke = "#05070A";
  if (type === "battery") {
    const bars = 4;
    return (
      <svg width="96" height="60" viewBox="0 0 96 60">
        <rect x="6" y="8" width="74" height="44" rx="8" fill="#141A20" stroke={stroke} strokeWidth="5" />
        <rect x="9" y="11" width="68" height="38" rx="6" fill="none" stroke="#C9D2DA" strokeWidth="3" />
        <rect x="80" y="20" width="10" height="20" rx="3" fill="#C9D2DA" stroke={stroke} strokeWidth="3.5" />
        {Array.from({ length: bars }).map((_, i) => {
          const lit = progress * bars > i + 0.15;
          return (
            <rect
              key={i}
              x={15 + i * 15.5}
              y="17"
              width="12"
              height="26"
              rx="2"
              fill={lit ? color : "#26303A"}
              opacity={lit ? 0.85 + 0.15 * Math.sin(frame / 6 + i) : 1}
            />
          );
        })}
      </svg>
    );
  }
  if (type === "signal") {
    return (
      <svg width="80" height="64" viewBox="0 0 80 64">
        {[0, 1, 2, 3].map((i) => {
          const lit = progress * 4 > i + 0.15;
          const h = 16 + i * 12;
          return (
            <rect
              key={i}
              x={8 + i * 17}
              y={58 - h}
              width="12"
              height={h}
              rx="2"
              fill={lit ? color : "#26303A"}
              stroke={stroke}
              strokeWidth="3"
            />
          );
        })}
      </svg>
    );
  }
  if (type === "bolt") {
    return (
      <svg width="60" height="72" viewBox="0 0 60 72">
        <polygon points="34,4 8,40 28,40 22,68 52,28 32,28 40,4" fill={color} stroke={stroke} strokeWidth="4.5" strokeLinejoin="round" opacity={0.5 + 0.5 * progress} />
      </svg>
    );
  }
  if (type === "thermo") {
    const fillH = 34 * progress;
    return (
      <svg width="52" height="76" viewBox="0 0 52 76">
        <rect x="16" y="4" width="20" height="50" rx="10" fill="#141A20" stroke={stroke} strokeWidth="4.5" />
        <circle cx="26" cy="58" r="14" fill={color} stroke={stroke} strokeWidth="4.5" />
        <rect x="22" y={50 - fillH} width="8" height={fillH + 4} rx="3" fill={color} />
        {[16, 26, 36].map((y) => (
          <line key={y} x1="38" y1={y} x2="46" y2={y} stroke="#C9D2DA" strokeWidth="3" strokeLinecap="round" />
        ))}
      </svg>
    );
  }
  return null;
};

// ------------------------------------------------------------------
// Main
// ------------------------------------------------------------------
export const MechaCaption: React.FC<MechaCaptionProps> = (props) => {
  const {
    tag,
    segments,
    subText,
    accentColor,
    icon = "none",
    position = "center",
    scale = 1,
    previewBackground = false,
  } = { ...defaultMechaCaptionProps, ...props };

  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const [handle] = useState(() => delayRender("Loading fonts for MechaCaption"));
  useEffect(() => {
    ensureFontsLoaded()
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);

  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

  // ---- Entrance ----
  const bracketP = interpolate(frame, [0, 12], [0, 1], { ...clamp, easing: Easing.bezier(0.2, 0.8, 0.2, 1) });
  const plateP = interpolate(frame, [4, 16], [0, 1], { ...clamp, easing: Easing.bezier(0.3, 0.9, 0.2, 1) });
  const tagSpring = spring({ frame: frame - 8, fps, config: { damping: 12, stiffness: 160, mass: 0.6 } });
  const iconSpring = spring({ frame: frame - 10, fps, config: { damping: 11, stiffness: 140, mass: 0.7 } });
  const countP = interpolate(frame, [12, 38], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const subP = spring({ frame: frame - 22, fps, config: { damping: 16, stiffness: 120 } });
  const shimmerX = interpolate(frame, [30, 52], [-30, 130], clamp);
  const glow = interpolate(Math.sin(frame / 9), [-1, 1], [0.35, 0.75]);

  // ---- Exit ----
  const exitStart = durationInFrames - 16;
  const exitP = interpolate(frame, [exitStart, durationInFrames - 2], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.6, 0, 0.8, 0.4),
  });

  // Character stagger units
  let unitIndex = 0;
  const renderSegment = (seg: CaptionSegment, si: number) => {
    const color = seg.accent ? accentColor : "#EAECEF";
    const shadow = seg.accent
      ? `0 6px 18px rgba(0,0,0,0.75), 0 0 26px ${accentColor}${Math.round(glow * 120).toString(16).padStart(2, "0")}`
      : "0 6px 18px rgba(0,0,0,0.75)";

    const unitStyle = (idx: number): React.CSSProperties => {
      const s = spring({ frame: frame - 12 - idx * 2, fps, config: { damping: 13, stiffness: 170, mass: 0.6 } });
      return {
        display: "inline-block",
        transform: `translateY(${(1 - s) * 46}px) scale(${0.8 + 0.2 * s})`,
        opacity: Math.min(1, s * 1.4),
        filter: s < 0.98 ? `blur(${(1 - Math.min(s, 1)) * 8}px)` : "none",
      };
    };

    if (seg.countUp) {
      const target = parseFloat(seg.text);
      const decimals = (seg.text.split(".")[1] || "").length;
      const shown = isNaN(target) ? seg.text : (target * countP).toFixed(decimals);
      const idx = unitIndex++;
      return (
        <span key={si} style={{ ...unitStyle(idx), position: "relative", color, textShadow: shadow, margin: "0 6px" }}>
          <span style={{ visibility: "hidden" }}>{seg.text}</span>
          <span style={{ position: "absolute", right: 0, top: 0, fontVariantNumeric: "tabular-nums" }}>{shown}</span>
        </span>
      );
    }
    return (
      <span key={si} style={{ color, textShadow: shadow }}>
        {Array.from(seg.text).map((ch, ci) => (
          <span key={ci} style={unitStyle(unitIndex++)}>
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </span>
    );
  };

  const positionStyle: React.CSSProperties =
    position === "bottom"
      ? { justifyContent: "flex-end", alignItems: "center", paddingBottom: 120 }
      : position === "lower-left"
      ? { justifyContent: "flex-end", alignItems: "flex-start", padding: "0 0 130px 140px" }
      : { justifyContent: "center", alignItems: "center" };

  return (
    <>
      <AbsoluteFill
        style={{
          fontFamily: "'Alibaba PuHuiTi', sans-serif",
          display: "flex",
          flexDirection: "column",
          ...positionStyle,
          background: previewBackground
            ? "radial-gradient(circle at 30% 40%, #2a2f38 0%, #14171c 45%, #08090b 100%)"
            : "transparent",
        }}
      >
        <div
          style={{
            position: "relative",
            transform: `scale(${scale}) translateX(${exitP * -60}px)`,
            transformOrigin: position === "lower-left" ? "left bottom" : "center",
            opacity: 1 - exitP,
            clipPath: `inset(-60px -60px -60px calc(${exitP * 110}% - 60px))`,
          }}
        >
          {/* Left hook */}
          <div
            style={{
              position: "absolute",
              left: -18,
              top: "38%",
              width: 20,
              height: 16,
              borderLeft: `5px solid ${accentColor}`,
              borderBottom: `5px solid ${accentColor}`,
              opacity: bracketP,
              transform: `translateX(${(1 - bracketP) * 14}px)`,
            }}
          />
      
          {/* Right slanted bracket */}
          <div
            style={{
              position: "absolute",
              right: -26,
              top: 2,
              bottom: 8,
              width: 22,
              borderTop: `5px solid ${accentColor}`,
              borderRight: `5px solid ${accentColor}`,
              transform: `skewX(-12deg) scaleY(${bracketP})`,
              transformOrigin: "top",
            }}
          />
      
          {/* Bottom bracket */}
          <div
            style={{
              position: "absolute",
              left: -12,
              right: -4,
              bottom: -18,
              height: 16,
              borderLeft: `5px solid ${accentColor}`,
              borderRight: `5px solid ${accentColor}`,
              borderBottom: `5px solid ${accentColor}`,
              transform: `scaleX(${bracketP})`,
              transformOrigin: "center",
              boxShadow: `0 6px 18px ${accentColor}33`,
            }}
          />
      
          {/* Tag tab */}
          <div
            style={{
              position: "absolute",
              top: -22,
              left: 48,
              zIndex: 3,
              padding: "4px 26px",
              background: "#10151C",
              border: `1.5px solid ${accentColor}66`,
              transform: `skewX(-14deg) translateY(${(1 - tagSpring) * -20}px)`,
              opacity: Math.min(1, tagSpring * 1.4),
              color: accentColor,
              fontSize: 20,
              fontWeight: 900,
              letterSpacing: "2.5px",
              whiteSpace: "nowrap",
            }}
          >
            {tag}
          </div>
      
          {/* Plate (wipe-in) */}
          <div style={{ clipPath: `inset(0 ${(1 - plateP) * 100}% 0 0)` }}>
            <div
              style={{
                position: "relative",
                clipPath: "polygon(34px 0, 100% 0, calc(100% - 34px) 100%, 0 100%)",
                backgroundImage: `radial-gradient(${accentColor}2E 1.3px, transparent 1.8px), linear-gradient(100deg, #161B22 0%, #0A0D12 55%, #141920 100%)`,
                backgroundSize: "9px 9px, 100% 100%",
                padding: subText ? "30px 78px 24px 70px" : "30px 78px 30px 70px",
                display: "flex",
                alignItems: "center",
                gap: 30,
                overflow: "hidden",
              }}
            >
              {/* top highlight */}
              <div style={{ position: "absolute", top: 0, left: 34, right: 0, height: 2, background: `${accentColor}55` }} />
      
              {/* shimmer */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: `${shimmerX}%`,
                  width: 140,
                  transform: "skewX(-20deg)",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)",
                  pointerEvents: "none",
                }}
              />
      
              {icon !== "none" && (
                <div
                  style={{
                    transform: `scale(${0.5 + 0.5 * iconSpring}) rotate(${(1 - iconSpring) * -20}deg)`,
                    opacity: Math.min(1, iconSpring * 1.4),
                    filter: `drop-shadow(0 6px 10px rgba(0,0,0,0.7)) drop-shadow(0 0 12px ${accentColor}44)`,
                  }}
                >
                  <CaptionIconSvg type={icon} color={accentColor} progress={countP} frame={frame} />
                </div>
              )}
      
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    fontSize: 104,
                    fontWeight: 900,
                    lineHeight: 1.05,
                    letterSpacing: "3px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {segments.map(renderSegment)}
                </div>
      
                {subText && (
                  <div
                    style={{
                      marginTop: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      opacity: subP,
                      transform: `translateX(${(1 - subP) * -24}px)`,
                    }}
                  >
                    <div style={{ width: 28, height: 6, background: accentColor, transform: "skewX(-20deg)" }} />
                    <span style={{ fontSize: 32, fontWeight: 700, color: "#9AA4B2", letterSpacing: "4px", whiteSpace: "nowrap" }}>
                      {subText}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <Interactive.Div
        name="Text"
        style={{
          position: "absolute",
          translate: "882.6px 481.5px",
          fontFamily: "sans-serif",
          fontSize: 81,
          color: "white"
        }}
      >Text</Interactive.Div>
      <Solid
        width={1920}
        height={1080}
        color="gray"
        style={{ position: "absolute" }}
      />
      <Solid
        width={1920}
        height={1080}
        color="gray"
        style={{ position: "absolute" }}
      />
      <Solid
        width={1920}
        height={1080}
        color="gray"
        style={{ position: "absolute" }}
      />
    </>
  );
};
