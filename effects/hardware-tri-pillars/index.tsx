import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ensureFontsLoaded } from "../../src/styles/loadFonts";
import { BatteryPhoneIsoSvg } from "./icons/BatteryPhoneIsoSvg";
import { ChipMotherboardIsoSvg } from "./icons/ChipMotherboardIsoSvg";
import { SystemGearSlidersIsoSvg } from "./icons/SystemGearSlidersIsoSvg";
import {
  LowPowerCoolIsoSvg,
  RedCapModemIsoSvg,
  SpeedBalanceIsoSvg,
} from "./icons/RedCapIcons";
import { BottomHudBanner, NumberBadgeSvg } from "./HudComponents";
export {
  RedCapComparisonShowcase,
  defaultRedCapShowcaseProps,
  type RedCapComparisonShowcaseProps,
} from "./RedCapComparisonShowcase";

export const HARDWARE_TRI_PILLARS_DURATION = 240; // 8 seconds @ 30fps

export type PillarIconType =
  | "battery"
  | "chip"
  | "system"
  | "redcap"
  | "low-power"
  | "speed-balance";

export interface HardwarePillarItem {
  number: 1 | 2 | 3;
  iconType?: PillarIconType;
  tag: string;
  titlePrefix: string;
  titleSuffix: string;
  accentColor: string;
  cardTopTint: string;
  cardDotColor: string;
  ambientGlowColor: string;
}

export interface HardwareTriPillarsProps {
  pillars: [HardwarePillarItem, HardwarePillarItem, HardwarePillarItem];
}

export const defaultHardwareTriPillarsProps: HardwareTriPillarsProps = {
  pillars: [
    {
      number: 1,
      iconType: "battery",
      tag: "BATTERY",
      titlePrefix: "电池",
      titleSuffix: "容量",
      accentColor: "#63C93E",
      cardTopTint: "rgba(58, 92, 24, 0.72)",
      cardDotColor: "#78E048",
      ambientGlowColor: "rgba(99, 201, 62, 0.16)",
    },
    {
      number: 2,
      iconType: "chip",
      tag: "CHIP",
      titlePrefix: "芯片",
      titleSuffix: "能效",
      accentColor: "#40B5BC",
      cardTopTint: "rgba(18, 72, 74, 0.76)",
      cardDotColor: "#50DCE5",
      ambientGlowColor: "rgba(64, 181, 188, 0.16)",
    },
    {
      number: 3,
      iconType: "system",
      tag: "SYSTEM",
      titlePrefix: "系统",
      titleSuffix: "调度",
      accentColor: "#3D80D9",
      cardTopTint: "rgba(16, 48, 82, 0.78)",
      cardDotColor: "#4DA0FF",
      ambientGlowColor: "rgba(61, 128, 217, 0.18)",
    },
  ],
};

/**
 * 极力猫 5G RedCap 随身 WiFi 三栏科普预设（1.轻量化5G / 2.功耗锐减 / 3.告别卡顿）
 */
export const defaultRedCapTriPillarsProps: HardwareTriPillarsProps = {
  pillars: [
    {
      number: 1,
      iconType: "redcap",
      tag: "REDCAP 5G",
      titlePrefix: "轻量",
      titleSuffix: "化5G",
      accentColor: "#40B5BC",
      cardTopTint: "rgba(18, 72, 74, 0.76)",
      cardDotColor: "#50DCE5",
      ambientGlowColor: "rgba(64, 181, 188, 0.16)",
    },
    {
      number: 2,
      iconType: "low-power",
      tag: "LOW POWER",
      titlePrefix: "功耗",
      titleSuffix: "锐减",
      accentColor: "#63C93E",
      cardTopTint: "rgba(58, 92, 24, 0.72)",
      cardDotColor: "#78E048",
      ambientGlowColor: "rgba(99, 201, 62, 0.16)",
    },
    {
      number: 3,
      iconType: "speed-balance",
      tag: "SWEET SPOT",
      titlePrefix: "告别",
      titleSuffix: "卡顿",
      accentColor: "#3D80D9",
      cardTopTint: "rgba(16, 48, 82, 0.78)",
      cardDotColor: "#4DA0FF",
      ambientGlowColor: "rgba(61, 128, 217, 0.18)",
    },
  ],
};

export const HardwareTriPillars: React.FC<HardwareTriPillarsProps> = (props) => {
  const { pillars = defaultHardwareTriPillarsProps.pillars } = props;

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const [fontHandle] = useState(() =>
    delayRender("Loading Alibaba PuHuiTi fonts for HardwareTriPillars")
  );

  useEffect(() => {
    ensureFontsLoaded()
      .then(() => continueRender(fontHandle))
      .catch((err) => {
        console.error("Font load error:", err);
        continueRender(fontHandle);
      });
  }, [fontHandle]);

  // Global subtle exit fade at the very end of the 8s clip (frames 215-240)
  const exitProgress = interpolate(frame, [216, 238], [0, 1], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const masterOpacity = 1 - exitProgress;
  const masterScale = 1 - exitProgress * 0.03;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0B0C0E",
        overflow: "hidden",
        fontFamily: "'Alibaba PuHuiTi', sans-serif",
      }}
    >
      {/* ============================================================
          1. THREE VERTICAL DARK ARCHITECTURAL BACKDROP COLUMNS
         ============================================================ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          opacity: masterOpacity,
          transform: `scale(${masterScale})`,
        }}
      >
        {[0, 1, 2].map((colIdx) => {
          const colSpring = spring({
            frame: Math.max(0, frame - colIdx * 7),
            fps,
            config: { damping: 16, stiffness: 100, mass: 0.9 },
          });

          const isMiddle = colIdx === 1;
          const pillar = pillars[colIdx];

          return (
            <div
              key={colIdx}
              style={{
                position: "relative",
                width: 632,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                // Left & Right columns are full-bleed dark bands; Middle column has a subtle dark frame behind a rounded pillar
                background: isMiddle
                  ? "linear-gradient(180deg, #1E2024 0%, #14171C 45%, #090A0D 100%)"
                  : "linear-gradient(180deg, #15171A 0%, #101215 55%, #07080A 100%)",
                borderLeft: colIdx > 0 ? "2px solid rgba(0,0,0,0.85)" : "none",
                borderRight: colIdx < 2 ? "2px solid rgba(0,0,0,0.85)" : "none",
                boxShadow: "inset 0 0 80px rgba(0,0,0,0.75)",
              }}
            >
              {/* Middle Column Rounded Dark Inner Pillar Card (Matches Screenshot) */}
              {isMiddle && (
                <div
                  style={{
                    position: "absolute",
                    top: 38,
                    bottom: -20,
                    left: 16,
                    right: 16,
                    borderRadius: "42px 42px 0 0",
                    background:
                      "linear-gradient(180deg, #141619 0%, #0E1014 55%, #07080A 100%)",
                    boxShadow:
                      "0 -10px 35px rgba(0,0,0,0.75), inset 0 1px 1px rgba(255,255,255,0.06)",
                  }}
                />
              )}

              {/* Subtle Ambient Color Glow Behind Each Column */}
              <div
                style={{
                  position: "absolute",
                  top: 180,
                  width: 480,
                  height: 480,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${pillar.ambientGlowColor} 0%, rgba(0,0,0,0) 70%)`,
                  filter: "blur(24px)",
                  opacity: colSpring,
                  pointerEvents: "none",
                }}
              />

              {/* ============================================================
                  2. CHAMFERED HALFTONE ILLUSTRATION CARD + NUMBER + 2.5D ICON
                 ============================================================ */}
              <div
                style={{
                  position: "relative",
                  marginTop: 96,
                  width: 492,
                  height: 586,
                  transform: `translateY(${(1 - colSpring) * 50}px) scale(${
                    0.9 + 0.1 * colSpring
                  })`,
                  opacity: Math.min(1, colSpring * 1.3),
                }}
              >
                {/* Chamfered Card Background with Halftone Dot Pattern */}
                <svg
                  width="492"
                  height="586"
                  viewBox="0 0 492 586"
                  style={{
                    position: "absolute",
                    inset: 0,
                    overflow: "visible",
                  }}
                >
                  <defs>
                    <linearGradient
                      id={`card-grad-${colIdx}`}
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor={pillar.cardTopTint} />
                      <stop offset="58%" stopColor="rgba(6, 10, 12, 0.92)" />
                      <stop offset="100%" stopColor="#000000" />
                    </linearGradient>

                    <linearGradient
                      id={`dots-fade-${colIdx}`}
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.32" />
                      <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.12" />
                      <stop offset="85%" stopColor="#FFFFFF" stopOpacity="0" />
                    </linearGradient>

                    <pattern
                      id={`card-dots-${colIdx}`}
                      width="10"
                      height="10"
                      patternUnits="userSpaceOnUse"
                      patternTransform="rotate(22)"
                    >
                      <circle
                        cx="3"
                        cy="3"
                        r="1.5"
                        fill={pillar.cardDotColor}
                      />
                    </pattern>

                    <mask id={`dots-mask-${colIdx}`}>
                      <rect
                        width="492"
                        height="586"
                        fill={`url(#dots-fade-${colIdx})`}
                      />
                    </mask>

                    <clipPath id={`chamfer-clip-${colIdx}`}>
                      <polygon points="0,0 446,0 492,46 492,586 0,586" />
                    </clipPath>
                  </defs>

                  <g clipPath={`url(#chamfer-clip-${colIdx})`}>
                    {/* Main Gradient Fill */}
                    <rect
                      width="492"
                      height="586"
                      fill={`url(#card-grad-${colIdx})`}
                    />
                    {/* Halftone Dots Masked to Upper-Middle Area */}
                    <rect
                      width="492"
                      height="586"
                      fill={`url(#card-dots-${colIdx})`}
                      mask={`url(#dots-mask-${colIdx})`}
                    />
                  </g>

                  {/* Subtle Top/Left/Right Chamfer Border Line (Bottom fades cleanly into black) */}
                  <polyline
                    points="0,586 0,0 446,0 492,46 492,586"
                    fill="none"
                    stroke={pillar.accentColor}
                    strokeOpacity="0.14"
                    strokeWidth="1.5"
                  />
                </svg>

                {/* Top-Left Blocky Pixel Number (1 / 2 / 3) Overlapping Card Top Edge */}
                <div
                  style={{
                    position: "absolute",
                    top: -22,
                    left: -6,
                    zIndex: 10,
                  }}
                >
                  <NumberBadgeSvg
                    number={pillar.number}
                    color={pillar.accentColor}
                    frame={frame}
                    fps={fps}
                    enterDelay={colIdx * 8 + 4}
                  />
                </div>

                {/* Central 2.5D Isometric Vector Illustration */}
                <div
                  style={{
                    position: "absolute",
                    top: 38,
                    left: 26,
                    right: 26,
                    bottom: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 5,
                  }}
                >
                  {(pillar.iconType === "battery" ||
                    (!pillar.iconType && colIdx === 0)) && (
                    <BatteryPhoneIsoSvg
                      frame={frame}
                      fps={fps}
                      enterDelay={colIdx * 9 + 6}
                    />
                  )}
                  {(pillar.iconType === "chip" ||
                    (!pillar.iconType && colIdx === 1)) && (
                    <ChipMotherboardIsoSvg
                      frame={frame}
                      fps={fps}
                      enterDelay={colIdx * 9 + 6}
                    />
                  )}
                  {(pillar.iconType === "system" ||
                    (!pillar.iconType && colIdx === 2)) && (
                    <SystemGearSlidersIsoSvg
                      frame={frame}
                      fps={fps}
                      enterDelay={colIdx * 9 + 6}
                    />
                  )}
                  {pillar.iconType === "redcap" && (
                    <RedCapModemIsoSvg
                      frame={frame}
                      fps={fps}
                      enterDelay={colIdx * 9 + 6}
                    />
                  )}
                  {pillar.iconType === "low-power" && (
                    <LowPowerCoolIsoSvg
                      frame={frame}
                      fps={fps}
                      enterDelay={colIdx * 9 + 6}
                    />
                  )}
                  {pillar.iconType === "speed-balance" && (
                    <SpeedBalanceIsoSvg
                      frame={frame}
                      fps={fps}
                      enterDelay={colIdx * 9 + 6}
                    />
                  )}
                </div>
              </div>

              {/* ============================================================
                  3. BOTTOM SLANTED HUD BANNER WITH BRACKETS & HEADLINE
                 ============================================================ */}
              <div
                style={{
                  position: "relative",
                  marginTop: 28,
                  zIndex: 12,
                }}
              >
                <BottomHudBanner
                  tagText={pillar.tag}
                  titlePrefix={pillar.titlePrefix}
                  titleSuffix={pillar.titleSuffix}
                  accentColor={pillar.accentColor}
                  frame={frame}
                  fps={fps}
                  enterDelay={colIdx * 8 + 12}
                />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
