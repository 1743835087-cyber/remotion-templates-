import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ensureFontsLoaded } from "../../src/styles/loadFonts";
import { RedCapModemIsoSvg } from "./icons/RedCapIcons";

export interface RedCapComparisonShowcaseProps {
  /**
   * 左侧设备图片路径（支持填入 public/ 下的实拍抠图文件名，例如 "ginlemag_5g.png"；
   * 留空则默认使用内置 2.5D 极客湾画风极力猫 5G RedCap 随身 WiFi 模型）
   */
  productImage?: string;
  /** 顶部对比痛点卡（满血 5G） */
  topCompareTag: string;
  topCompareMain: string;
  topCompareIssue: string;
  topAccentColor: string;
  /** 中间主推核心卡（RedCap 轻量化 5G） */
  centerNumber: 1 | 2 | 3;
  centerTag: string;
  centerTitlePrefix: string;
  centerTitleSuffix: string;
  centerSubTitle: string;
  centerBadgeText: string;
  centerAccentColor: string;
  /** 左侧功耗下降浮动徽章 */
  powerDropLabel: string;
  powerDropSub: string;
  powerDropColor: string;
  /** 底部对比痛点卡（传统 4G） */
  bottomCompareTag: string;
  bottomCompareMain: string;
  bottomCompareIssue: string;
  bottomAccentColor: string;
}

export const defaultRedCapShowcaseProps: RedCapComparisonShowcaseProps = {
  productImage: "",
  topCompareTag: "FULL 5G / 传统基带",
  topCompareMain: "满血5G",
  topCompareIssue: "功耗高 · 发热重",
  topAccentColor: "#F25C5C",

  centerNumber: 1,
  centerTag: "5G R17 REDCAP",
  centerTitlePrefix: "Red",
  centerTitleSuffix: "Cap",
  centerSubTitle: "轻量化 5G 黄金架构",
  centerBadgeText: "均衡甜点芯片",
  centerAccentColor: "#40B5BC",

  powerDropLabel: "功耗",
  powerDropSub: "大幅降低",
  powerDropColor: "#63C93E",

  bottomCompareTag: "LEGACY 4G / 老旧频段",
  bottomCompareMain: "传统4G",
  bottomCompareIssue: "网速慢 · 易卡顿",
  bottomAccentColor: "#E8883A",
};

/**
 * 极客湾机甲斜切风格的横向对比条组件（用于替代原图简陋的上下圆角胶囊）
 */
const MechaComparisonBar: React.FC<{
  tagText: string;
  mainTitle: string;
  issueText: string;
  accentColor: string;
  frame: number;
  fps: number;
  enterDelay: number;
}> = ({
  tagText,
  mainTitle,
  issueText,
  accentColor,
  frame,
  fps,
  enterDelay,
}) => {
  const localFrame = Math.max(0, frame - enterDelay);
  const pop = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.85 },
  });

  const bracketProgress = interpolate(pop, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "relative",
        width: 980,
        height: 154,
        transform: `translateX(${(1 - pop) * 65}px) scale(${0.92 + 0.08 * pop})`,
        opacity: Math.min(1, pop * 1.35),
      }}
    >
      <svg
        width="980"
        height="154"
        viewBox="0 0 980 154"
        style={{
          position: "absolute",
          inset: 0,
          overflow: "visible",
          filter: "drop-shadow(0 14px 28px rgba(0,0,0,0.85))",
        }}
      >
        <defs>
          <linearGradient
            id={`cmp-grad-${mainTitle}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#14181F" />
            <stop offset="55%" stopColor="#0B0E13" />
            <stop offset="100%" stopColor="#1A1215" />
          </linearGradient>
          <pattern
            id={`cmp-dots-${mainTitle}`}
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(22)"
          >
            <circle cx="2" cy="2" r="1.2" fill={accentColor} opacity="0.14" />
          </pattern>
        </defs>

        {/* Slanted Chamfered Trapezoid Plate */}
        <polygon
          points="32,24 932,24 958,48 936,134 8,134"
          fill={`url(#cmp-grad-${mainTitle})`}
          stroke="#252D38"
          strokeWidth="1.8"
        />
        <polygon
          points="32,24 932,24 958,48 936,134 8,134"
          fill={`url(#cmp-dots-${mainTitle})`}
        />

        {/* Top-Left Parallelogram English Tag Tab */}
        <polygon
          points="56,6 286,6 276,34 46,34"
          fill="#10151C"
          stroke="#2A3542"
          strokeWidth="1.5"
        />

        {/* Left Tech Hook */}
        <polyline
          points="18,48 12,62 32,62"
          fill="none"
          stroke={accentColor}
          strokeWidth="4.5"
          strokeLinecap="square"
          style={{
            strokeDasharray: 50,
            strokeDashoffset: (1 - bracketProgress) * 50,
          }}
        />

        {/* Right Slanted Tech Bracket */}
        <polyline
          points="948,26 968,26 944,132"
          fill="none"
          stroke={accentColor}
          strokeWidth="4.5"
          strokeLinecap="square"
          style={{
            strokeDasharray: 150,
            strokeDashoffset: (1 - bracketProgress) * 150,
          }}
        />

        {/* Bottom Full-Width Bracket Bar */}
        <polyline
          points="14,134 14,146 942,146 942,134"
          fill="none"
          stroke={accentColor}
          strokeWidth="4"
          strokeLinecap="square"
          style={{
            strokeDasharray: 980,
            strokeDashoffset: (1 - bracketProgress) * 980,
          }}
        />
      </svg>

      {/* Top-Left Tag Text */}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 52,
          width: 228,
          height: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Alibaba PuHuiTi', sans-serif",
          fontWeight: 900,
          fontSize: 16,
          letterSpacing: "1.5px",
          color: accentColor,
          transform: "skewX(-14deg)",
        }}
      >
        {tagText}
      </div>

      {/* Main Content Row: [满血5G]  |  [功耗高 · 发热重] */}
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 48,
          right: 48,
          bottom: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "'Alibaba PuHuiTi', sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
          }}
        >
          <span
            style={{
              fontSize: 70,
              fontWeight: 900,
              color: "#EAECEF",
              letterSpacing: "2px",
              textShadow: "0 4px 14px rgba(0,0,0,0.75)",
            }}
          >
            {mainTitle}
          </span>

          {/* Slanted Divider Bar */}
          <div
            style={{
              width: 4,
              height: 54,
              backgroundColor: "#2C3542",
              transform: "skewX(-15deg)",
            }}
          />

          <span
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: accentColor,
              letterSpacing: "2px",
              textShadow: `0 4px 16px rgba(0,0,0,0.8), 0 0 22px ${accentColor}33`,
            }}
          >
            {issueText}
          </span>
        </div>

        {/* Right Side Warning Status Pill */}
        <div
          style={{
            padding: "8px 18px",
            backgroundColor: "rgba(0,0,0,0.55)",
            border: `2px solid ${accentColor}88`,
            transform: "skewX(-12deg)",
            color: accentColor,
            fontSize: 20,
            fontWeight: 900,
            letterSpacing: "1.5px",
          }}
        >
          体验痛点
        </div>
      </div>
    </div>
  );
};

export const RedCapComparisonShowcase: React.FC<
  RedCapComparisonShowcaseProps
> = (props) => {
  const {
    productImage = defaultRedCapShowcaseProps.productImage,
    topCompareTag = defaultRedCapShowcaseProps.topCompareTag,
    topCompareMain = defaultRedCapShowcaseProps.topCompareMain,
    topCompareIssue = defaultRedCapShowcaseProps.topCompareIssue,
    topAccentColor = defaultRedCapShowcaseProps.topAccentColor,
    centerTag = defaultRedCapShowcaseProps.centerTag,
    centerTitlePrefix = defaultRedCapShowcaseProps.centerTitlePrefix,
    centerTitleSuffix = defaultRedCapShowcaseProps.centerTitleSuffix,
    centerSubTitle = defaultRedCapShowcaseProps.centerSubTitle,
    centerBadgeText = defaultRedCapShowcaseProps.centerBadgeText,
    centerAccentColor = defaultRedCapShowcaseProps.centerAccentColor,
    powerDropLabel = defaultRedCapShowcaseProps.powerDropLabel,
    powerDropSub = defaultRedCapShowcaseProps.powerDropSub,
    powerDropColor = defaultRedCapShowcaseProps.powerDropColor,
    bottomCompareTag = defaultRedCapShowcaseProps.bottomCompareTag,
    bottomCompareMain = defaultRedCapShowcaseProps.bottomCompareMain,
    bottomCompareIssue = defaultRedCapShowcaseProps.bottomCompareIssue,
    bottomAccentColor = defaultRedCapShowcaseProps.bottomAccentColor,
  } = props;

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const [fontHandle] = useState(() =>
    delayRender("Loading Alibaba PuHuiTi fonts for RedCapComparisonShowcase")
  );

  useEffect(() => {
    ensureFontsLoaded()
      .then(() => continueRender(fontHandle))
      .catch((err) => {
        console.error("Font load error:", err);
        continueRender(fontHandle);
      });
  }, [fontHandle]);

  const leftColSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 105, mass: 0.9 },
  });

  const centerHeroSpring = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: { damping: 13, stiffness: 115, mass: 0.85 },
  });

  const powerArrowSpring = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 11, stiffness: 130, mass: 0.8 },
  });

  const bracketProgress = interpolate(centerHeroSpring, [0, 1], [0, 1]);
  const arrowBob = Math.sin(frame / 10) * 6;

  // Exit fade
  const exitProgress = interpolate(frame, [216, 238], [0, 1], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const masterOpacity = 1 - exitProgress;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0B0C0E",
        backgroundImage: `
          radial-gradient(circle at 65% 50%, rgba(64, 181, 188, 0.12) 0%, rgba(0,0,0,0) 60%),
          linear-gradient(180deg, #15181D 0%, #0D0F13 55%, #07080A 100%)
        `,
        overflow: "hidden",
        fontFamily: "'Alibaba PuHuiTi', sans-serif",
        opacity: masterOpacity,
      }}
    >
      {/* ============================================================
          LEFT COLUMN: PRODUCT SHOWCASE PILLAR (极力猫 5G 随身 WiFi)
         ============================================================ */}
      <div
        style={{
          position: "absolute",
          top: 42,
          bottom: 42,
          left: 64,
          width: 620,
          borderRadius: 36,
          background:
            "linear-gradient(180deg, #16191F 0%, #0E1115 60%, #07080B 100%)",
          border: "2px solid #222832",
          boxShadow: "0 20px 50px rgba(0,0,0,0.85)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "36px 28px 34px",
          boxSizing: "border-box",
          transform: `translateX(${(1 - leftColSpring) * -60}px)`,
          opacity: leftColSpring,
        }}
      >
        {/* Top Chamfered Halftone Display Box Inside Left Pillar */}
        <div
          style={{
            position: "relative",
            width: 540,
            height: 700,
          }}
        >
          <svg
            width="540"
            height="700"
            viewBox="0 0 540 700"
            style={{ position: "absolute", inset: 0 }}
          >
            <defs>
              <linearGradient
                id="left-card-grad"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="rgba(22, 68, 82, 0.78)" />
                <stop offset="65%" stopColor="rgba(8, 12, 16, 0.94)" />
                <stop offset="100%" stopColor="#050608" />
              </linearGradient>
              <pattern
                id="left-card-dots"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(22)"
              >
                <circle cx="3" cy="3" r="1.5" fill="#48DCE5" opacity="0.24" />
              </pattern>
              <clipPath id="left-chamfer">
                <polygon points="0,0 490,0 540,50 540,700 0,700" />
              </clipPath>
            </defs>
            <g clipPath="url(#left-chamfer)">
              <rect width="540" height="700" fill="url(#left-card-grad)" />
              <rect width="540" height="420" fill="url(#left-card-dots)" />
            </g>
            <polyline
              points="0,700 0,0 490,0 540,50 540,700"
              fill="none"
              stroke="#40B5BC"
              strokeOpacity="0.22"
              strokeWidth="1.5"
            />
          </svg>

          {/* Device Visual (Either User Real Photo or 2.5D Vector Model) */}
          <div
            style={{
              position: "absolute",
              inset: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {productImage ? (
              <Img
                src={
                  productImage.startsWith("http")
                    ? productImage
                    : staticFile(productImage)
                }
                style={{
                  maxWidth: "92%",
                  maxHeight: "92%",
                  objectFit: "contain",
                  filter: "drop-shadow(0 20px 32px rgba(0,0,0,0.8))",
                }}
              />
            ) : (
              <RedCapModemIsoSvg frame={frame} fps={fps} enterDelay={4} />
            )}
          </div>
        </div>

        {/* Bottom Product Name HUD Plate */}
        <div
          style={{
            position: "relative",
            width: 540,
            height: 140,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="540"
            height="140"
            viewBox="0 0 540 140"
            style={{ position: "absolute", inset: 0 }}
          >
            <polygon
              points="26,18 518,18 496,122 6,122"
              fill="#0A0D12"
              stroke="#242E3A"
              strokeWidth="1.5"
            />
            <polyline
              points="12,122 12,134 522,134 522,122"
              fill="none"
              stroke="#40B5BC"
              strokeWidth="4"
            />
          </svg>
          <div
            style={{
              position: "relative",
              fontSize: 54,
              fontWeight: 900,
              letterSpacing: "1.5px",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: "#40B5BC" }}>极力猫</span>
            <span style={{ color: "#EAECEF", marginLeft: 10 }}>5G随身WiFi</span>
          </div>
        </div>
      </div>

      {/* ============================================================
          RIGHT COLUMN: 3-TIER COMPARISON HUD CARDS (Replicating Uploaded Screenshot Layout)
         ============================================================ */}
      <div
        style={{
          position: "absolute",
          top: 56,
          bottom: 56,
          left: 748,
          right: 64,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        {/* 1. TOP CARD: 满血 5G 功耗高 · 发热重 */}
        <MechaComparisonBar
          tagText={topCompareTag}
          mainTitle={topCompareMain}
          issueText={topCompareIssue}
          accentColor={topAccentColor}
          frame={frame}
          fps={fps}
          enterDelay={6}
        />

        {/* 2. MIDDLE ROW: [↓ 功耗] CALLOUT + [RedCap 轻量化 5G] HERO MECHA CARD */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: 12,
          }}
        >
          {/* Left Floating 3D Power-Drop Badge (↓ 功耗) */}
          <div
            style={{
              position: "relative",
              width: 210,
              height: 360,
              borderRadius: 24,
              background:
                "linear-gradient(180deg, rgba(44, 78, 22, 0.65) 0%, rgba(10, 16, 12, 0.95) 100%)",
              border: `2px solid ${powerDropColor}66`,
              boxShadow: "0 16px 36px rgba(0,0,0,0.8)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${0.85 + 0.15 * powerArrowSpring})`,
              opacity: Math.min(1, powerArrowSpring * 1.35),
            }}
          >
            {/* 3D Cel-Shaded Downward Arrow SVG */}
            <svg
              width="120"
              height="150"
              viewBox="0 0 120 150"
              style={{
                transform: `translateY(${arrowBob}px)`,
                filter: "drop-shadow(0 10px 16px rgba(0,0,0,0.75))",
              }}
            >
              {/* 3D Dark Green Extrusion */}
              <polygon
                points="48,14 82,14 82,82 106,82 65,138 55,132 94,76 72,76 72,20"
                fill="#1E5216"
                stroke="#050805"
                strokeWidth="5"
                strokeLinejoin="round"
              />
              {/* Bright Green Front Face */}
              <polygon
                points="42,14 76,14 76,82 100,82 59,138 18,82 42,82"
                fill={powerDropColor}
                stroke="#050805"
                strokeWidth="5.5"
                strokeLinejoin="round"
              />
              <line
                x1="48"
                y1="20"
                x2="48"
                y2="84"
                stroke="#D4FFCC"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>

            <div
              style={{
                marginTop: 12,
                fontSize: 64,
                fontWeight: 900,
                color: powerDropColor,
                lineHeight: 1.05,
                textShadow: "0 4px 12px rgba(0,0,0,0.85)",
              }}
            >
              {powerDropLabel}
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: 22,
                fontWeight: 800,
                color: "#D8E8D4",
                letterSpacing: "2px",
              }}
            >
              {powerDropSub}
            </div>
          </div>

          {/* Right Center Hero Card: RedCap 轻量化 5G (With Halftone Chamfer & Mecha Brackets) */}
          <div
            style={{
              position: "relative",
              width: 845,
              height: 440,
              transform: `translateY(${(1 - centerHeroSpring) * 35}px) scale(${
                0.9 + 0.1 * centerHeroSpring
              })`,
              opacity: Math.min(1, centerHeroSpring * 1.35),
            }}
          >
            <svg
              width="845"
              height="440"
              viewBox="0 0 845 440"
              style={{
                position: "absolute",
                inset: 0,
                overflow: "visible",
                filter: "drop-shadow(0 20px 42px rgba(0,0,0,0.9))",
              }}
            >
              <defs>
                <linearGradient
                  id="hero-redcap-grad"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="rgba(22, 84, 88, 0.85)" />
                  <stop offset="65%" stopColor="rgba(8, 16, 20, 0.96)" />
                  <stop offset="100%" stopColor="#050709" />
                </linearGradient>
                <pattern
                  id="hero-redcap-dots"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(22)"
                >
                  <circle
                    cx="3"
                    cy="3"
                    r="1.6"
                    fill={centerAccentColor}
                    opacity="0.28"
                  />
                </pattern>
                <clipPath id="hero-chamfer">
                  <polygon points="0,0 785,0 845,60 845,440 0,440" />
                </clipPath>
              </defs>

              <g clipPath="url(#hero-chamfer)">
                <rect width="845" height="440" fill="url(#hero-redcap-grad)" />
                <rect width="845" height="290" fill="url(#hero-redcap-dots)" />
              </g>

              {/* Chamfer Outline */}
              <polygon
                points="0,0 785,0 845,60 845,440 0,440"
                fill="none"
                stroke={centerAccentColor}
                strokeOpacity="0.35"
                strokeWidth="2"
              />

              {/* Top-Left Parallelogram Tag Tab */}
              <polygon
                points="42,-16 286,-16 274,22 30,22"
                fill="#0D1518"
                stroke={centerAccentColor}
                strokeWidth="2"
              />

              {/* Glowing Cyan Corner HUD Brackets (Echoing Original Screenshot's Glowing Frame) */}
              <polyline
                points="-10,60 -10,-10 25,-10"
                fill="none"
                stroke={centerAccentColor}
                strokeWidth="5.5"
                strokeLinecap="square"
                style={{
                  strokeDasharray: 120,
                  strokeDashoffset: (1 - bracketProgress) * 120,
                }}
              />
              <polyline
                points="800,-10 855,-10 855,55"
                fill="none"
                stroke={centerAccentColor}
                strokeWidth="5.5"
                strokeLinecap="square"
                style={{
                  strokeDasharray: 130,
                  strokeDashoffset: (1 - bracketProgress) * 130,
                }}
              />
              <polyline
                points="-10,395 -10,452 855,452 855,395"
                fill="none"
                stroke={centerAccentColor}
                strokeWidth="5.5"
                strokeLinecap="square"
                style={{
                  strokeDasharray: 1020,
                  strokeDashoffset: (1 - bracketProgress) * 1020,
                }}
              />
            </svg>

            {/* Top-Left English Tag Text */}
            <div
              style={{
                position: "absolute",
                top: -12,
                left: 38,
                width: 238,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: 19,
                letterSpacing: "2px",
                color: centerAccentColor,
                transform: "skewX(-14deg)",
              }}
            >
              {centerTag}
            </div>

            {/* Top-Right Badge Pill */}
            <div
              style={{
                position: "absolute",
                top: 26,
                right: 46,
                padding: "8px 22px",
                backgroundColor: "rgba(10, 22, 26, 0.85)",
                border: `2px solid ${centerAccentColor}`,
                transform: "skewX(-12deg)",
                color: "#80F5FF",
                fontSize: 22,
                fontWeight: 900,
                letterSpacing: "2px",
              }}
            >
              {centerBadgeText}
            </div>

            {/* Center Headline: RedCap / 轻量化 5G */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 18,
              }}
            >
              <div
                style={{
                  fontSize: 136,
                  fontWeight: 900,
                  lineHeight: 1.0,
                  letterSpacing: "3px",
                  textShadow: "0 10px 28px rgba(0,0,0,0.85)",
                }}
              >
                <span style={{ color: centerAccentColor }}>
                  {centerTitlePrefix}
                </span>
                <span style={{ color: "#EAECEF" }}>{centerTitleSuffix}</span>
              </div>

              {/* Bottom Slanted Sub-Banner Inside Hero Card */}
              <div
                style={{
                  marginTop: 22,
                  padding: "12px 48px",
                  backgroundColor: "rgba(6, 10, 14, 0.88)",
                  borderLeft: `6px solid ${centerAccentColor}`,
                  borderRight: `6px solid ${centerAccentColor}`,
                  transform: "skewX(-12deg)",
                  boxShadow: "0 10px 24px rgba(0,0,0,0.7)",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    transform: "skewX(12deg)",
                    fontSize: 58,
                    fontWeight: 900,
                    color: "#EAECEF",
                    letterSpacing: "4px",
                  }}
                >
                  {centerSubTitle}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. BOTTOM CARD: 传统 4G 网速慢 · 易卡顿 */}
        <MechaComparisonBar
          tagText={bottomCompareTag}
          mainTitle={bottomCompareMain}
          issueText={bottomCompareIssue}
          accentColor={bottomAccentColor}
          frame={frame}
          fps={fps}
          enterDelay={30}
        />
      </div>
    </AbsoluteFill>
  );
};
