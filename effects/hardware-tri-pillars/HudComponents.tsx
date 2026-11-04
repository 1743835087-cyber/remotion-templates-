import React from "react";
import { interpolate, spring } from "remotion";

export const NumberBadgeSvg: React.FC<{
  number: 1 | 2 | 3;
  color: string;
  frame: number;
  fps: number;
  enterDelay: number;
}> = ({ number, color, frame, fps, enterDelay }) => {
  const pop = spring({
    frame: Math.max(0, frame - enterDelay),
    fps,
    config: { damping: 12, stiffness: 140, mass: 0.7 },
  });

  const scale = interpolate(pop, [0, 1], [0.4, 1]);
  const translateY = interpolate(pop, [0, 1], [-24, 0]);

  return (
    <svg
      width="82"
      height="78"
      viewBox="0 0 82 78"
      style={{
        overflow: "visible",
        transform: `translateY(${translateY}px) scale(${scale})`,
        transformOrigin: "left top",
        opacity: Math.min(1, pop * 1.4),
        filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.65))",
      }}
    >
      {number === 1 && (
        <path
          d="M 8 16
             L 24 4
             L 45 4
             L 45 56
             L 60 56
             L 60 72
             L 8 72
             L 8 56
             L 23 56
             L 23 24
             L 8 24
             Z"
          fill={color}
        />
      )}

      {number === 2 && (
        <path
          d="M 6 14
             L 18 4
             L 62 4
             L 72 14
             L 72 34
             L 60 44
             L 26 44
             L 26 56
             L 72 56
             L 72 72
             L 6 72
             L 6 40
             L 18 30
             L 50 30
             L 50 18
             L 24 18
             L 24 25
             L 6 25
             Z"
          fill={color}
        />
      )}

      {number === 3 && (
        <path
          d="M 6 14
             L 18 4
             L 60 4
             L 72 14
             L 72 31
             L 61 38
             L 72 45
             L 72 62
             L 60 72
             L 18 72
             L 6 62
             L 6 49
             L 24 49
             L 24 56
             L 50 56
             L 50 45
             L 30 45
             L 30 31
             L 50 31
             L 50 18
             L 24 18
             L 24 25
             L 6 25
             Z"
          fill={color}
        />
      )}
    </svg>
  );
};

export const BottomHudBanner: React.FC<{
  tagText: string;
  titlePrefix: string;
  titleSuffix: string;
  accentColor: string;
  frame: number;
  fps: number;
  enterDelay: number;
}> = ({
  tagText,
  titlePrefix,
  titleSuffix,
  accentColor,
  frame,
  fps,
  enterDelay,
}) => {
  const localFrame = Math.max(0, frame - enterDelay);

  const bannerSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.85 },
  });

  const textSpring = spring({
    frame: Math.max(0, localFrame - 5),
    fps,
    config: { damping: 13, stiffness: 130, mass: 0.8 },
  });

  // Animated bracket reveal
  const bracketProgress = interpolate(bannerSpring, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "relative",
        width: 536,
        height: 156,
        transform: `translateY(${(1 - bannerSpring) * 35}px) scale(${
          0.9 + 0.1 * bannerSpring
        })`,
        opacity: Math.min(1, bannerSpring * 1.35),
      }}
    >
      <svg
        width="536"
        height="156"
        viewBox="0 0 536 156"
        style={{
          position: "absolute",
          inset: 0,
          overflow: "visible",
          filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.85))",
        }}
      >
        <defs>
          {/* Subtle carbon noise / metallic grain gradient on the dark trapezoid */}
          <linearGradient id={`hud-bg-${tagText}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14181D" />
            <stop offset="35%" stopColor="#080A0D" />
            <stop offset="70%" stopColor="#040507" />
            <stop offset="100%" stopColor="#12161B" />
          </linearGradient>
          <pattern
            id={`hud-dots-${tagText}`}
            width="4"
            height="4"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="0.6" fill="#FFFFFF" opacity="0.06" />
          </pattern>
        </defs>

        {/* Main Slanted Black Trapezoid Plate */}
        <polygon
          points="32,20 510,20 484,136 6,136"
          fill={`url(#hud-bg-${tagText})`}
          stroke="#1C222A"
          strokeWidth="1.5"
        />
        <polygon
          points="32,20 510,20 484,136 6,136"
          fill={`url(#hud-dots-${tagText})`}
        />

        {/* Subtle metallic brushed sheen in bottom-left corner of plate */}
        <polygon
          points="16,90 125,20 32,20 6,136 95,136"
          fill="#FFFFFF"
          opacity="0.03"
        />

        {/* Top-Left English Tag Parallelogram Tab */}
        <polygon
          points="66,4 202,4 193,31 57,31"
          fill="#11161B"
          stroke="#26303A"
          strokeWidth="1.2"
        />

        {/* Left Middle Tech Hook Accent */}
        <polyline
          points="16,44 12,56 29,56"
          fill="none"
          stroke={accentColor}
          strokeWidth="4.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
          style={{
            strokeDasharray: 40,
            strokeDashoffset: (1 - bracketProgress) * 40,
          }}
        />

        {/* Right Slanted Tech Line + Hook Accent */}
        <polyline
          points="518,22 528,22 504,130"
          fill="none"
          stroke={accentColor}
          strokeWidth="4.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
          style={{
            strokeDasharray: 140,
            strokeDashoffset: (1 - bracketProgress) * 140,
          }}
        />

        {/* Bottom Full-Width Tech Bracket Bar [ ______________ ] */}
        <polyline
          points="12,135 12,148 518,148 518,135"
          fill="none"
          stroke={accentColor}
          strokeWidth="4.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
          style={{
            strokeDasharray: 560,
            strokeDashoffset: (1 - bracketProgress) * 560,
          }}
        />
      </svg>

      {/* Top-Left English Pill Label Text (BATTERY / CHIP / SYSTEM) */}
      <div
        style={{
          position: "absolute",
          top: 5,
          left: 60,
          width: 138,
          height: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Alibaba PuHuiTi', sans-serif",
          fontWeight: 900,
          fontSize: 18,
          letterSpacing: "1.5px",
          color: accentColor,
          transform: "skewX(-14deg)",
          textShadow: `0 0 12px ${accentColor}55`,
        }}
      >
        {tagText}
      </div>

      {/* Main Heavy Bold Chinese Headline (e.g. 电池容量 / 芯片能效 / 系统调度) */}
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 0,
          right: 12,
          bottom: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Alibaba PuHuiTi', sans-serif",
          fontWeight: 900,
          fontSize: 82,
          letterSpacing: "2px",
          lineHeight: 1,
          transform: `scale(${0.92 + 0.08 * textSpring})`,
          opacity: textSpring,
          userSelect: "none",
        }}
      >
        <span
          style={{
            color: accentColor,
            textShadow: "0 4px 12px rgba(0,0,0,0.65)",
          }}
        >
          {titlePrefix}
        </span>
        <span
          style={{
            color: "#EAECEF",
            textShadow: "0 4px 12px rgba(0,0,0,0.65)",
          }}
        >
          {titleSuffix}
        </span>
      </div>
    </div>
  );
};
