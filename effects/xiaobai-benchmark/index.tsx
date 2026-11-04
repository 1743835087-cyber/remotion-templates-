import React, { useEffect, useState } from "react";
import {
  continueRender,
  delayRender,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { HeaderBar } from "./HeaderBar";
import { PhoneSection } from "./PhoneSection";
import { MiddleSection } from "./MiddleSection";
import { MetricCards } from "./MetricCards";
import { FpsCurve } from "./FpsCurve";
import { ensureFontsLoaded } from "../../src/styles/loadFonts";
import "../../src/styles/fonts.css";

// Load Alibaba PuHuiTi font
ensureFontsLoaded();

export const XiaobaiBenchmark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const [handle] = useState(() => delayRender("Loading fonts for XiaobaiBenchmark"));

  useEffect(() => {
    ensureFontsLoaded()
      .then(() => continueRender(handle))
      .catch((err) => {
        console.error("Font loading error:", err);
        continueRender(handle);
      });
  }, [handle]);

  // Entrance springs
  const headerSpring = spring({ frame: frame - 2, fps, config: { damping: 14 } });
  const phoneSpring = spring({ frame: frame - 10, fps, config: { damping: 14 } });
  const middleSpring = spring({ frame: frame - 18, fps, config: { damping: 14 } });
  const metricsSpring = spring({ frame: frame - 26, fps, config: { damping: 14 } });
  const curveSpring = spring({ frame: frame - 34, fps, config: { damping: 14 } });

  // Subtle ambient breathing of the HUD grid
  const hudGlow = interpolate(Math.sin(frame / 20), [-1, 1], [0.85, 1.1]);

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        backgroundColor: "#070A0F",
        backgroundImage: `
          radial-gradient(circle at 50% 45%, rgba(15, 25, 40, ${0.4 * hudGlow}) 0%, rgba(7, 10, 15, 0.98) 75%),
          linear-gradient(180deg, #05070B 0%, #080D14 50%, #05070B 100%)
        `,
        overflow: "hidden",
        fontFamily: "'Alibaba PuHuiTi', sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "36px 60px 48px",
        boxSizing: "border-box",
      }}
    >
      {/* Background Cyber Tech Grid & Crosshairs */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.18,
          pointerEvents: "none",
        }}
      >
        <defs>
          <pattern
            id="xb-grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="#00E5FF"
              strokeWidth="0.5"
            />
            <circle cx="0" cy="0" r="1.2" fill="#00E5FF" opacity="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#xb-grid)" />

        {/* Tech decorative crosshairs */}
        <g stroke="#FFA000" strokeWidth="1" opacity="0.7">
          <line x1="120" y1="120" x2="136" y2="120" />
          <line x1="128" y1="112" x2="128" y2="128" />

          <line x1="1800" y1="120" x2="1816" y2="120" />
          <line x1="1808" y1="112" x2="1808" y2="128" />

          <line x1="120" y1="960" x2="136" y2="960" />
          <line x1="128" y1="952" x2="128" y2="968" />

          <line x1="1800" y1="960" x2="1816" y2="960" />
          <line x1="1808" y1="952" x2="1808" y2="968" />
        </g>
      </svg>

      {/* Top Header Bar */}
      <div
        style={{
          width: "100%",
          opacity: headerSpring,
          transform: `translateY(${(1 - headerSpring) * -25}px)`,
        }}
      >
        <HeaderBar />
      </div>

      {/* Main Content Layout (Left Phone, Middle Conditions/Game, Right Metrics/Curve) */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 20,
          marginTop: 18,
        }}
      >
        {/* Left Column: Phone Showcase */}
        <div
          style={{
            opacity: phoneSpring,
            transform: `scale(${phoneSpring}) translateY(${(1 - phoneSpring) * 35}px)`,
          }}
        >
          <PhoneSection />
        </div>

        {/* Middle Column: Standards & Game Screenshot */}
        <div
          style={{
            opacity: middleSpring,
            transform: `scale(${middleSpring}) translateY(${(1 - middleSpring) * 35}px)`,
          }}
        >
          <MiddleSection startFrame={18} />
        </div>

        {/* Right Column: Metrics Data & FPS Curve */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* Top: 4-Column Metrics */}
          <div
            style={{
              opacity: metricsSpring,
              transform: `scale(${metricsSpring}) translateY(${(1 - metricsSpring) * 30}px)`,
            }}
          >
            <MetricCards startFrame={30} />
          </div>

          {/* Bottom: 30min Frame Rate Curve */}
          <div
            style={{
              opacity: curveSpring,
              transform: `scale(${curveSpring}) translateY(${(1 - curveSpring) * 30}px)`,
            }}
          >
            <FpsCurve startFrame={65} duration={110} />
          </div>
        </div>
      </div>

      {/* Bottom Tech HUD Status Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 40px",
          color: "rgba(255, 255, 255, 0.35)",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: 1.5,
        }}
      >
        <span>S.WHITE REVIEW BENCHMARK SYSTEM // DELTA ACTION 185HZ</span>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span>FPS STABILITY: 99.4%</span>
          <span style={{ color: "#38EF7D" }}>● HARDWARE READY</span>
        </div>
      </div>
    </div>
  );
};
