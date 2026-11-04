import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ensureFontsLoaded } from "../../src/styles/loadFonts";

export const PHONE_SPEC_DURATION = 240;

export const phoneSpec = {
  tierLabel: "价位段",
  tierValue: "¥ 1500以下入门机",
  name: "一加 Turbo 6X",
  price: 1100,
  subtitle: "目前最低是1100块钱左右",
  footnote: "*手机价格为叠加各种补贴后的最低价格",
};

// ========================================================
// 1. APPLE KINETIC MOTION ENGINE (清晰肉眼可见的出入场系统)
// ========================================================

/**
 * 苹果发布会式全生命周期动效计算：
 * 具备明确的【入场】、【驻留微动】和【出场退散】三阶段。
 */
interface AppleMotionConfig {
  frame: number;
  fps: number;
  inFrame: number;
  outFrame?: number;
  inDistanceY?: number;
  outDistanceY?: number;
  damping?: number;
  stiffness?: number;
  mass?: number;
}

const computeAppleMotion = ({
  frame,
  fps,
  inFrame,
  outFrame = 200,
  inDistanceY = 40,
  outDistanceY = -35,
  damping = 18,
  stiffness = 110,
  mass = 0.85,
}: AppleMotionConfig) => {
  // 1. 入场阶段前：完全隐藏
  if (frame < inFrame) {
    return {
      opacity: 0,
      transform: `translate3d(0, ${inDistanceY}px, 0) scale(0.92)`,
      filter: "blur(12px)",
      isVisible: false,
    };
  }

  // 2. 出场阶段 (Exit Phase)
  if (frame >= outFrame) {
    const exitProgress = interpolate(frame, [outFrame, outFrame + 22], [0, 1], {
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const translateY = exitProgress * outDistanceY;
    const blur = exitProgress * 12;
    const scale = 1 - exitProgress * 0.05;
    const opacity = 1 - exitProgress;

    return {
      opacity: Math.max(0, opacity),
      transform: `translate3d(0, ${translateY.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`,
      filter: blur > 0.1 ? `blur(${blur.toFixed(2)}px)` : "none",
      isVisible: opacity > 0.01,
    };
  }

  // 3. 入场与驻留阶段 (Entrance & Hold Phase)
  const enterSpring = spring({
    frame: frame - inFrame,
    fps,
    config: { damping, stiffness, mass },
  });

  const translateY = (1 - enterSpring) * inDistanceY;
  const blur = Math.max(0, (1 - Math.min(enterSpring, 1)) * 10);
  const scale = 0.92 + enterSpring * 0.08;
  const opacity = Math.min(1, enterSpring * 1.25);

  return {
    opacity,
    transform: `translate3d(0, ${translateY.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`,
    filter: blur > 0.1 ? `blur(${blur.toFixed(2)}px)` : "none",
    isVisible: true,
  };
};

/**
 * 苹果遮罩字符动画组件：
 * 文字置于 overflow:hidden 的遮罩槽内，自下而上拔地而起，出场时向上失焦退场
 */
const AppleMaskedText: React.FC<{
  text: string;
  frame: number;
  fps: number;
  inFrame: number;
  outFrame?: number;
  fontSize: number;
  fontWeight?: number;
  color?: string;
  letterSpacing?: number;
  staggerPerChar?: number;
  textShadow?: string;
  enableShimmer?: boolean;
}> = ({
  text,
  frame,
  fps,
  inFrame,
  outFrame = 205,
  fontSize,
  fontWeight = 800,
  color = "#ffffff",
  letterSpacing = 1,
  staggerPerChar = 2.5,
  textShadow,
  enableShimmer = false,
}) => {
  const chars = Array.from(text);

  // 苹果冷白镜面扫光反射
  const shimmerPos = interpolate(frame, [inFrame + 10, inFrame + 65], [-50, 150], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
        padding: "6px 8px 10px 4px",
      }}
    >
      {chars.map((char, idx) => {
        const charMotion = computeAppleMotion({
          frame,
          fps,
          inFrame: inFrame + idx * staggerPerChar,
          outFrame: outFrame + idx * 1.2,
          inDistanceY: fontSize * 0.85, // 足够明显的遮罩上升位移
          outDistanceY: -fontSize * 0.6,
          damping: 17,
          stiffness: 115,
          mass: 0.8,
        });

        return (
          <span
            key={idx}
            style={{
              display: "inline-block",
              fontSize,
              fontWeight,
              color,
              letterSpacing: char === " " ? 12 : letterSpacing,
              textShadow:
                textShadow ||
                "0 0 18px rgba(255,255,255,0.45), 0 4px 18px rgba(0,0,0,0.85)",
              ...charMotion,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}

      {/* 扫光层 */}
      {enableShimmer && (
        <div
          style={{
            position: "absolute",
            inset: "-20px",
            pointerEvents: "none",
            mixBlendMode: "overlay",
            background:
              "linear-gradient(112deg, transparent 35%, rgba(255,255,255,0.9) 50%, transparent 65%)",
            transform: `translateX(${shimmerPos}%)`,
            opacity: interpolate(
              frame,
              [inFrame + 8, inFrame + 20, inFrame + 60, inFrame + 75],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
          }}
        />
      )}
    </div>
  );
};

// ==========================================
// 2. LOGO & ICONS
// ==========================================

const TopLeftLogo: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const motion = computeAppleMotion({
    frame,
    fps,
    inFrame: 4,
    outFrame: 220,
    inDistanceY: 20,
  });

  return (
    <div style={{ position: "absolute", left: 24, top: 22, ...motion }}>
      <svg width="36" height="38" viewBox="0 0 36 38" fill="none">
        <path d="M4 4L14 9V25L4 17V4Z" fill="rgba(255,255,255,0.35)" />
        <path d="M32 4L22 9V25L32 17V4Z" fill="rgba(255,255,255,0.25)" />
        <path d="M15 12L18 14L21 12V31L18 35L15 31V12Z" fill="rgba(255,255,255,0.42)" />
        <path d="M7 20L15 27V32L7 24V20Z" fill="rgba(255,255,255,0.22)" />
        <path d="M29 20L21 27V32L29 24V20Z" fill="rgba(255,255,255,0.3)" />
      </svg>
    </div>
  );
};

const HeaderIcon: React.FC<{
  type: "cpu" | "screen" | "battery" | "camera" | "body" | "price";
}> = ({ type }) => {
  const stroke = "#e4e4e7";
  switch (type) {
    case "cpu":
      return (
        <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
          <rect x="8" y="8" width="20" height="20" rx="4" stroke={stroke} strokeWidth="2" />
          <rect x="13" y="13" width="10" height="10" rx="2" stroke={stroke} strokeWidth="1.6" />
          <line x1="12" y1="3" x2="12" y2="8" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          <line x1="18" y1="3" x2="18" y2="8" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          <line x1="24" y1="3" x2="24" y2="8" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="28" x2="12" y2="33" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          <line x1="18" y1="28" x2="18" y2="33" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          <line x1="24" y1="28" x2="24" y2="33" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          <line x1="3" y1="12" x2="8" y2="12" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          <line x1="3" y1="18" x2="8" y2="18" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          <line x1="3" y1="24" x2="8" y2="24" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          <line x1="28" y1="12" x2="33" y2="12" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          <line x1="28" y1="18" x2="33" y2="18" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          <line x1="28" y1="24" x2="33" y2="24" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "screen":
      return (
        <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
          <rect x="9" y="4" width="18" height="28" rx="4" stroke={stroke} strokeWidth="2" />
          <line x1="15" y1="8" x2="21" y2="8" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
          <line x1="14" y1="28" x2="22" y2="28" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "battery":
      return (
        <svg width="36" height="34" viewBox="0 0 38 36" fill="none">
          <rect x="3" y="9" width="28" height="18" rx="4" stroke={stroke} strokeWidth="2" />
          <path
            d="M31 14H34C34.5523 14 35 14.4477 35 15V21C35 21.5523 34.5523 22 34 22H31"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M18 13L14 18.5H18.5L16.5 23L21.5 17.2H17L18 13Z" fill={stroke} />
        </svg>
      );
    case "camera":
    case "body":
      return (
        <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
          <path
            d="M5 11C5 9.89543 5.89543 9 7 9H11L13.5 6H22.5L25 9H29C30.1046 9 31 9.89543 31 11V27C31 28.1046 30.1046 29 29 29H7C5.89543 29 5 28.1046 5 27V11Z"
            stroke={stroke}
            strokeWidth="2"
          />
          <circle cx="18" cy="19" r="5.5" stroke={stroke} strokeWidth="2" />
        </svg>
      );
    case "price":
      return (
        <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
          <path
            d="M18.5 5H29C30.1046 5 31 5.89543 31 7V17.5L17.5 31C16.7 31.8 15.3 31.8 14.5 31L5 21.5C4.2 20.7 4.2 19.3 5 18.5L18.5 5Z"
            stroke="#ffffff"
            strokeWidth="2.2"
          />
          <circle cx="24.5" cy="11.5" r="2" fill="#ffffff" />
        </svg>
      );
  }
};

// Watermark illustrations inside each glass card
const CardWatermark: React.FC<{
  type: "cpu" | "screen" | "battery" | "camera" | "body" | "price";
  frame: number;
}> = ({ type, frame }) => {
  const floatY = Math.sin(frame / 45) * 3;
  switch (type) {
    case "cpu":
      return (
        <svg
          width="210"
          height="210"
          viewBox="0 0 210 210"
          fill="none"
          style={{
            position: "absolute",
            right: 18,
            bottom: -12,
            opacity: 0.22,
            filter: "blur(1px)",
            transform: `translateY(${floatY}px) rotate(10deg)`,
          }}
        >
          <rect
            x="45"
            y="45"
            width="120"
            height="120"
            rx="16"
            fill="rgba(255,255,255,0.06)"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="4"
          />
          <rect
            x="68"
            y="68"
            width="74"
            height="74"
            rx="10"
            fill="rgba(0,0,0,0.3)"
            stroke="rgba(255,255,255,0.38)"
            strokeWidth="3"
          />
          {[62, 84, 105, 126, 148].map((pos) => (
            <React.Fragment key={pos}>
              <line x1={pos} y1="22" x2={pos} y2="45" stroke="rgba(255,255,255,0.45)" strokeWidth="4.5" strokeLinecap="round" />
              <line x1={pos} y1="165" x2={pos} y2="188" stroke="rgba(255,255,255,0.45)" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="22" y1={pos} x2="45" y2={pos} stroke="rgba(255,255,255,0.45)" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="165" y1={pos} x2="188" y2={pos} stroke="rgba(255,255,255,0.45)" strokeWidth="4.5" strokeLinecap="round" />
            </React.Fragment>
          ))}
        </svg>
      );
    case "screen":
      return (
        <svg
          width="220"
          height="220"
          viewBox="0 0 220 220"
          fill="none"
          style={{
            position: "absolute",
            right: 8,
            bottom: -18,
            opacity: 0.2,
            filter: "blur(1px)",
            transform: `translateY(${floatY}px) rotate(-12deg)`,
          }}
        >
          <rect
            x="55"
            y="18"
            width="115"
            height="190"
            rx="20"
            fill="rgba(255,255,255,0.05)"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="4"
          />
          <text
            x="112"
            y="95"
            textAnchor="middle"
            fill="rgba(255,255,255,0.45)"
            fontSize="34"
            fontWeight="900"
          >
            6.7
          </text>
        </svg>
      );
    case "battery":
      return (
        <svg
          width="220"
          height="210"
          viewBox="0 0 220 210"
          fill="none"
          style={{
            position: "absolute",
            right: 14,
            bottom: -12,
            opacity: 0.2,
            filter: "blur(1.2px)",
            transform: `translateY(${floatY}px) rotate(-14deg)`,
          }}
        >
          <rect
            x="48"
            y="45"
            width="115"
            height="140"
            rx="18"
            fill="rgba(255,255,255,0.06)"
            stroke="rgba(255,255,255,0.48)"
            strokeWidth="4"
          />
          <path
            d="M110 70L88 116H114L98 162L134 108H108L122 70Z"
            fill="rgba(255,255,255,0.38)"
          />
        </svg>
      );
    case "camera":
      return (
        <svg
          width="230"
          height="230"
          viewBox="0 0 230 230"
          fill="none"
          style={{
            position: "absolute",
            right: 10,
            bottom: -22,
            opacity: 0.22,
            filter: "blur(1px)",
            transform: `translateY(${floatY}px) rotate(${frame * 0.2}deg)`,
          }}
        >
          <circle cx="115" cy="115" r="88" stroke="rgba(255,255,255,0.45)" strokeWidth="4" />
          <circle cx="115" cy="115" r="62" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />
          <circle cx="115" cy="115" r="38" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.5)" strokeWidth="3" />
        </svg>
      );
    case "body":
      return (
        <svg
          width="210"
          height="210"
          viewBox="0 0 210 210"
          fill="none"
          style={{
            position: "absolute",
            right: 18,
            bottom: -10,
            opacity: 0.2,
            filter: "blur(1px)",
            transform: `translateY(${floatY}px) rotate(10deg)`,
          }}
        >
          <line x1="48" y1="42" x2="48" y2="178" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" />
          <line x1="40" y1="42" x2="56" y2="42" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" />
          <line x1="40" y1="178" x2="56" y2="178" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" />
          <rect
            x="68"
            y="42"
            width="86"
            height="136"
            rx="16"
            fill="rgba(255,255,255,0.06)"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="3.5"
          />
        </svg>
      );
    case "price":
      return (
        <svg
          width="220"
          height="210"
          viewBox="0 0 220 210"
          fill="none"
          style={{
            position: "absolute",
            right: 16,
            bottom: -6,
            opacity: 0.24,
            filter: "blur(1.2px)",
            transform: `translateY(${floatY}px) rotate(-6deg)`,
          }}
        >
          <rect
            x="64"
            y="36"
            width="104"
            height="122"
            rx="12"
            fill="rgba(255,255,255,0.08)"
            stroke="rgba(255,255,255,0.42)"
            strokeWidth="3"
          />
          <line x1="82" y1="68" x2="148" y2="68" stroke="rgba(255,255,255,0.4)" strokeWidth="4" strokeLinecap="round" />
          <line x1="82" y1="92" x2="136" y2="92" stroke="rgba(255,255,255,0.35)" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
  }
};

// Dual Phone Render
const DualPhonesRender: React.FC<{ frame: number }> = ({ frame }) => {
  const floatOffset = Math.sin(frame / 45) * 3.5;

  return (
    <div
      style={{
        position: "relative",
        width: 560,
        height: 615,
        transform: `translateY(${floatOffset}px)`,
        maskImage: "linear-gradient(180deg, #000 68%, rgba(0,0,0,0.45) 88%, transparent 99%)",
        WebkitMaskImage:
          "linear-gradient(180deg, #000 68%, rgba(0,0,0,0.45) 88%, transparent 99%)",
      }}
    >
      {/* Left Phone: White/Silver Back View */}
      <div
        style={{
          position: "absolute",
          left: 34,
          top: 22,
          width: 228,
          height: 560,
          borderRadius: 36,
          transform: "perspective(1050px) rotateY(-24deg) rotateZ(-0.5deg)",
          background:
            "linear-gradient(155deg, #ffffff 0%, #f5f6f8 42%, #d5d7dc 75%, #9fa2a8 100%)",
          border: "2px solid #e8eaee",
          boxShadow:
            "11px 6px 0 #c9ccd2, 14px 8px 0 #8c9098, 26px 32px 55px rgba(0,0,0,0.85)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.07) 1px, transparent 1px)",
            backgroundSize: "5px 5px",
            maskImage: "linear-gradient(180deg, transparent 28%, rgba(0,0,0,0.9) 100%)",
            WebkitMaskImage:
              "linear-gradient(180deg, transparent 28%, rgba(0,0,0,0.9) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 1,
            borderRadius: 34,
            border: "2px solid rgba(255,255,255,0.92)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 20,
            top: 38,
            width: 54,
            height: 192,
            borderRadius: 28,
            background: "linear-gradient(135deg, #e8e8e8 0%, #787878 48%, #d0d0d0 100%)",
            padding: 5,
            boxShadow: "4px 6px 14px rgba(0,0,0,0.38), inset 0 1px 2px #fff",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 24,
              background: "linear-gradient(180deg, #1a1a1a 0%, #080808 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-evenly",
              padding: "6px 0",
            }}
          >
            {[0, 1, 2].map((lensIdx) => (
              <div
                key={lensIdx}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at 38% 35%, #2b4558 0%, #0f171e 28%, #050505 58%, #292929 72%, #0a0a0a 100%)",
                  border: "2.5px solid #3c3c3c",
                  boxShadow: "inset 0 2px 5px rgba(255,255,255,0.22)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 10,
                    top: 9,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(140,200,255,0.65), transparent 70%)",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Phone: Black Front Screen */}
      <div
        style={{
          position: "absolute",
          left: 172,
          top: 36,
          width: 236,
          height: 560,
          borderRadius: 36,
          transform: "perspective(1050px) rotateY(-24deg) rotateZ(-0.5deg)",
          background: "#080808",
          border: "2px solid #505050",
          boxShadow:
            "12px 6px 0 #3a3a3c, 15px 9px 0 #1c1c1e, 32px 36px 65px rgba(0,0,0,0.92)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 6,
            borderRadius: 30,
            background: "#0a0a0c",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 300,
              height: 300,
              right: -55,
              top: 50,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 68% 68%, #67645e 0%, #2b2a28 45%, #0c0c0c 80%)",
              borderRight: "3.5px solid rgba(242, 222, 165, 0.85)",
              borderBottom: "3.5px solid rgba(242, 222, 165, 0.85)",
              boxShadow: "8px 10px 26px rgba(235, 200, 115, 0.42)",
              transform: "rotate(-12deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 350,
              height: 430,
              left: -18,
              top: 192,
              borderRadius: "47%",
              background:
                "radial-gradient(circle at 38% 14%, #a8a6a2 0%, #52504d 38%, #1a1a1a 82%)",
              borderTop: "4px solid #fff3c4",
              boxShadow:
                "0 -8px 26px rgba(255, 226, 140, 0.65), inset 0 12px 28px rgba(255, 255, 255, 0.38)",
              transform: "rotate(-20deg)",
              overflow: "hidden",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 14,
              left: "50%",
              transform: "translateX(-50%)",
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#040404",
              border: "1.5px solid #252525",
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. APPLE LIQUID GLASS SPEC CARD (含出入场)
// ==========================================

interface SpecCardProps {
  index: number;
  iconType: "cpu" | "screen" | "battery" | "camera" | "body" | "price";
  label: string;
  value: string;
  lines: string[];
  isPriceCard?: boolean;
}

const SpecCard: React.FC<SpecCardProps> = ({
  index,
  iconType,
  label,
  value,
  lines,
  isPriceCard,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 节奏编排：6张卡片分成3组错落入场
  // Group 0 (cpu, screen): inFrame 28
  // Group 1 (battery, camera): inFrame 48
  // Group 2 (body, price): inFrame 68
  const groupIdx = Math.floor(index / 2);
  const columnIdx = index % 2;
  const inFrame = 28 + groupIdx * 20 + columnIdx * 5;
  const outFrame = 192 + (2 - groupIdx) * 10 - columnIdx * 4;

  const cardMotion = computeAppleMotion({
    frame,
    fps,
    inFrame,
    outFrame,
    inDistanceY: 50,
    outDistanceY: -45,
    damping: 18,
    stiffness: 105,
    mass: 0.9,
  });

  const glassSheenX = interpolate(
    frame,
    [inFrame + 6, inFrame + 50],
    [-110, 160],
    {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const priceHighlightOpacity = isPriceCard
    ? interpolate(frame, [85, 105], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }) * (frame >= outFrame ? Math.max(0, 1 - (frame - outFrame) / 15) : 1)
    : 0;

  const pulseGlow = isPriceCard ? 0.88 + Math.sin(frame / 9) * 0.12 : 0;

  return (
    <div
      style={{
        position: "relative",
        height: 256,
        padding: "24px 30px",
        boxSizing: "border-box",
        borderRadius: 22,
        background: isPriceCard
          ? "linear-gradient(135deg, rgba(255,255,255,0.17) 0%, rgba(255,255,255,0.06) 55%, rgba(255,255,255,0.12) 100%)"
          : "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.035) 50%, rgba(255,255,255,0.07) 100%)",
        backdropFilter: "blur(26px) saturate(180%)",
        WebkitBackdropFilter: "blur(26px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow: isPriceCard
          ? `inset 0 1.5px 1px 0 rgba(255,255,255,0.48), inset 0 -1px 1px 0 rgba(0,0,0,0.5), 0 20px 48px -10px rgba(0,0,0,0.7), 0 0 ${
              30 * priceHighlightOpacity
            }px rgba(255,255,255,0.2)`
          : "inset 0 1.5px 1px 0 rgba(255,255,255,0.32), inset 0 -1px 1px 0 rgba(0,0,0,0.4), 0 20px 40px -12px rgba(0,0,0,0.65)",
        ...cardMotion,
      }}
    >
      {/* 玻璃高光 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 22,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -60,
            background:
              "linear-gradient(125deg, transparent 38%, rgba(255,255,255,0.03) 46%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.04) 54%, transparent 62%)",
            transform: `translateX(${glassSheenX}%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 20,
            right: 20,
            top: 0,
            height: 1,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.65) 50%, transparent 100%)",
          }}
        />
        <CardWatermark type={iconType} frame={frame} />
      </div>

      {/* 跑马灯虚线边框 */}
      {isPriceCard && (
        <svg
          width="100%"
          height="100%"
          style={{
            position: "absolute",
            inset: -2,
            width: "calc(100% + 4px)",
            height: "calc(100% + 4px)",
            overflow: "visible",
            pointerEvents: "none",
            opacity: priceHighlightOpacity,
          }}
        >
          <rect
            x="2"
            y="2"
            rx="24"
            ry="24"
            width="calc(100% - 4px)"
            height="calc(100% - 4px)"
            fill="none"
            stroke="#ffffff"
            strokeWidth="4"
            strokeDasharray="16 12"
            strokeDashoffset={-frame * 0.9}
            style={{
              filter: `drop-shadow(0 0 ${8 * pulseGlow}px rgba(255,255,255,0.95)) drop-shadow(0 0 ${
                22 * pulseGlow
              }px rgba(255,255,255,0.5))`,
            }}
          />
        </svg>
      )}

      {/* Header Row */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
          ...computeAppleMotion({
            frame,
            fps,
            inFrame: inFrame + 5,
            outFrame: outFrame + 4,
            inDistanceY: 20,
            outDistanceY: -15,
          }),
        }}
      >
        <HeaderIcon type={iconType} />
        <span
          style={{
            color: "#d4d4d8",
            fontSize: 31,
            fontWeight: 500,
            letterSpacing: 0.5,
          }}
        >
          {label}
        </span>
        <div
          style={{
            flex: 1,
            height: 1,
            marginLeft: 10,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 100%)",
          }}
        />
      </div>

      {/* Main Spec Value - 遮罩上升 */}
      <div style={{ overflow: "hidden", marginBottom: isPriceCard ? 8 : 6 }}>
        <div
          style={{
            position: "relative",
            color: "#ffffff",
            fontSize: isPriceCard ? 66 : 49,
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: isPriceCard ? 0.5 : 0,
            textShadow: "0 2px 14px rgba(0,0,0,0.5), 0 0 16px rgba(255,255,255,0.25)",
            ...computeAppleMotion({
              frame,
              fps,
              inFrame: inFrame + 9,
              outFrame: outFrame + 6,
              inDistanceY: 36,
              outDistanceY: -28,
              damping: 17,
              stiffness: 115,
            }),
          }}
        >
          {value}
        </div>
      </div>

      {/* Sub-details */}
      {lines.map((line, lineIdx) => (
        <div key={line} style={{ overflow: "hidden" }}>
          <div
            style={{
              position: "relative",
              color: isPriceCard ? "#b0b0b8" : "#a1a1aa",
              fontSize: isPriceCard ? 27 : 22,
              fontWeight: 500,
              lineHeight: 1.48,
              ...computeAppleMotion({
                frame,
                fps,
                inFrame: inFrame + 14 + lineIdx * 4,
                outFrame: outFrame + 8 + lineIdx * 3,
                inDistanceY: 22,
                outDistanceY: -18,
              }),
            }}
          >
            {line}
          </div>
        </div>
      ))}
    </div>
  );
};

// ==========================================
// 4. MAIN COMPOSITION
// ==========================================

export const PhoneSpecBoard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [handle] = useState(() => delayRender("Load Alibaba PuHuiTi fonts"));

  useEffect(() => {
    ensureFontsLoaded()
      .then(() => continueRender(handle))
      .catch((err) => cancelRender(err));
  }, [handle]);

  // 左侧整体与手机
  const leftBoxMotion = computeAppleMotion({
    frame,
    fps,
    inFrame: 8,
    outFrame: 215,
    inDistanceY: 45,
    outDistanceY: -40,
    damping: 19,
    stiffness: 95,
  });

  const phonesMotion = computeAppleMotion({
    frame,
    fps,
    inFrame: 16,
    outFrame: 218,
    inDistanceY: 60,
    outDistanceY: -50,
    damping: 20,
    stiffness: 90,
  });

  // 价格数字从 0 滚到 1100
  const priceProgress = interpolate(frame, [78, 115], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const animatedPrice = Math.round(priceProgress * phoneSpec.price);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#09090b",
        color: "#ffffff",
        fontFamily: "'Alibaba PuHuiTi', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Microsoft YaHei', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* 苹果深空背景 */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 85% 75% at 48% 38%, #222226 0%, #121215 52%, #080809 100%)",
        }}
      />

      {/* 点阵网格 */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "11px 11px",
          maskImage:
            "radial-gradient(ellipse 92% 85% at 50% 48%, rgba(0,0,0,0.95) 25%, rgba(0,0,0,0.18) 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 92% 85% at 50% 48%, rgba(0,0,0,0.95) 25%, rgba(0,0,0,0.18) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* 斜切底部分隔线 */}
      <svg
        width="1920"
        height="1080"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <defs>
          <linearGradient id="appleFloorFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,0,0,0.5)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.95)" />
          </linearGradient>
        </defs>
        <path
          d="M -40 390 Q 340 650 860 910 L 1960 1080 L -40 1080 Z"
          fill="url(#appleFloorFill)"
        />
        <path
          d="M -40 390 Q 340 650 860 910"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1.5"
        />
      </svg>

      {/* Top-Left Watermark Shield Icon */}
      <TopLeftLogo frame={frame} fps={fps} />

      {/* LEFT COLUMN */}
      <div
        style={{
          position: "absolute",
          left: 66,
          top: 52,
          width: 566,
        }}
      >
        {/* Top Price Tier Capsule */}
        <div
          style={{
            position: "relative",
            height: 174,
            padding: "24px 30px",
            boxSizing: "border-box",
            borderRadius: 22,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.035) 100%)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow:
              "inset 0 1.5px 1px 0 rgba(255,255,255,0.35), inset 0 -1px 1px 0 rgba(0,0,0,0.4), 0 20px 40px -10px rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "stretch",
            gap: 16,
            ...leftBoxMotion,
          }}
        >
          <div
            style={{
              width: 8,
              marginTop: 10,
              marginBottom: 8,
              borderRadius: 4,
              background: "linear-gradient(180deg, #82828e 0%, #b8b8c2 100%)",
              boxShadow: "0 0 10px rgba(255,255,255,0.25)",
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              paddingTop: 2,
              paddingBottom: 4,
              overflow: "hidden",
            }}
          >
            <div style={{ overflow: "hidden" }}>
              <AppleMaskedText
                text={phoneSpec.tierLabel}
                frame={frame}
                fps={fps}
                inFrame={12}
                outFrame={214}
                fontSize={23}
                fontWeight={500}
                color="#a1a1aa"
              />
            </div>

            <div style={{ overflow: "hidden" }}>
              <AppleMaskedText
                text={phoneSpec.tierValue}
                frame={frame}
                fps={fps}
                inFrame={18}
                outFrame={216}
                fontSize={48}
                fontWeight={900}
                color="#e4e4e7"
              />
            </div>
          </div>
        </div>

        {/* 苹果大标题逐字升起 + 金属扫光 */}
        <div style={{ marginTop: 20, marginLeft: 10 }}>
          <AppleMaskedText
            text={phoneSpec.name}
            frame={frame}
            fps={fps}
            inFrame={22}
            outFrame={218}
            fontSize={72}
            fontWeight={900}
            color="#ffffff"
            letterSpacing={2}
            enableShimmer
          />
        </div>

        {/* Dual Phones Preview */}
        <div style={{ marginTop: 10, ...phonesMotion }}>
          <DualPhonesRender frame={frame} />
        </div>
      </div>

      {/* VERTICAL DIVIDER LINE */}
      <div
        style={{
          position: "absolute",
          left: 682,
          top: 48,
          width: 1.5,
          height: 836,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.3) 15%, rgba(255,255,255,0.25) 85%, rgba(255,255,255,0.06) 100%)",
        }}
      />

      {/* RIGHT COLUMN: 2x3 Grid of Spec Cards */}
      <div
        style={{
          position: "absolute",
          left: 718,
          right: 68,
          top: 48,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          columnGap: 28,
          rowGap: 32,
        }}
      >
        <SpecCard
          index={0}
          iconType="cpu"
          label="处理器"
          value="天玑 7360 SUPER"
          lines={["制程工艺：台积电 4nm"]}
        />
        <SpecCard
          index={1}
          iconType="screen"
          label="屏幕"
          value="6.72 英寸"
          lines={["分辨率：2400×1080 / 屏幕材料：LCD 屏", "屏幕刷新率：144Hz"]}
        />
        <SpecCard
          index={2}
          iconType="battery"
          label="电池与充电"
          value="7000mAh"
          lines={["有线充电：45 W", "无线充电：/"]}
        />
        <SpecCard
          index={3}
          iconType="camera"
          label="影像"
          value="主摄：50MP广角"
          lines={["长焦：/  超广角：/", "其它：2MP黑白镜头"]}
        />
        <SpecCard
          index={4}
          iconType="body"
          label="机身"
          value="约208g"
          lines={["长宽厚：165.85mm*76.00mm*8.55mm", "特色配置：NFC"]}
        />
        <SpecCard
          index={5}
          iconType="price"
          label="参考价格"
          value={`${animatedPrice}元`}
          lines={["储存版本：6+128GB"]}
          isPriceCard
        />
      </div>

      {/* BOTTOM CENTER SUBTITLE - 遮罩升起与出场退散 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 44,
          transform: "translateX(-50%)",
          overflow: "hidden",
        }}
      >
        <AppleMaskedText
          text={phoneSpec.subtitle}
          frame={frame}
          fps={fps}
          inFrame={95}
          outFrame={188} // 率先出场
          fontSize={44}
          fontWeight={700}
          color="#ffffff"
          textShadow="0 2px 10px rgba(0,0,0,0.95), 0 0 16px rgba(0,0,0,0.8)"
        />
      </div>

      {/* BOTTOM RIGHT FOOTNOTE */}
      <div
        style={{
          position: "absolute",
          right: 26,
          bottom: 44,
          overflow: "hidden",
        }}
      >
        <AppleMaskedText
          text={phoneSpec.footnote}
          frame={frame}
          fps={fps}
          inFrame={102}
          outFrame={188}
          fontSize={19}
          fontWeight={500}
          color="#a1a1aa"
        />
      </div>
    </AbsoluteFill>
  );
};
