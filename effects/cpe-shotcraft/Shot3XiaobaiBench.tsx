import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CpeHeaderBar } from "./cpe-bench/CpeHeaderBar";
import { CpeDeviceSection } from "./cpe-bench/CpeDeviceSection";
import { CpeStandardSection } from "./cpe-bench/CpeStandardSection";
import { CpeMetricCards } from "./cpe-bench/CpeMetricCards";
import { CpeThroughputCurve } from "./cpe-bench/CpeThroughputCurve";

interface Shot3XiaobaiBenchProps {
  isStandalone?: boolean;
}

export const Shot3XiaobaiBench: React.FC<Shot3XiaobaiBenchProps> = ({
  isStandalone = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance springs
  const headerSpring = spring({ frame: frame - 1, fps, config: { damping: 14 } });
  const deviceSpring = spring({ frame: frame - 5, fps, config: { damping: 14 } });
  const standardSpring = spring({ frame: frame - 9, fps, config: { damping: 14 } });
  const metricsSpring = spring({ frame: frame - 13, fps, config: { damping: 14 } });
  const curveSpring = spring({ frame: frame - 17, fps, config: { damping: 14 } });

  // Subtle ambient breathing of the HUD grid
  const hudGlow = interpolate(Math.sin(frame / 20), [-1, 1], [0.85, 1.1]);

  // Exit transition into Shot 4 (only when inside promo series)
  const exitOpacity = isStandalone
    ? 1
    : interpolate(frame, [105, 115], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
  const exitScale = isStandalone
    ? 1
    : interpolate(frame, [105, 115], [1, 0.94], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "36px 60px 48px",
        boxSizing: "border-box",
        opacity: exitOpacity,
        transform: `scale(${exitScale})`,
        overflow: "hidden",
      }}
    >
      {/* Background Tech HUD Grid & Crosshairs */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.16 * hudGlow,
          pointerEvents: "none",
        }}
      >
        <defs>
          <pattern
            id="cpe-bench-grid"
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
        <rect width="100%" height="100%" fill="url(#cpe-bench-grid)" />

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
        <CpeHeaderBar />
      </div>

      {/* Main Content Layout (Left CPE Device, Middle Conditions/Game, Right Metrics/Curve) */}
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
        {/* Left Column: 5G CPE Device Showcase */}
        <div
          style={{
            opacity: deviceSpring,
            transform: `scale(${deviceSpring}) translateY(${(1 - deviceSpring) * 35}px)`,
          }}
        >
          <CpeDeviceSection />
        </div>

        {/* Middle Column: Standards & Network Scene Screenshot */}
        <div
          style={{
            opacity: standardSpring,
            transform: `scale(${standardSpring}) translateY(${(1 - standardSpring) * 35}px)`,
          }}
        >
          <CpeStandardSection />
        </div>

        {/* Right Column: Metrics Data & Throughput Curve */}
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
            <CpeMetricCards startFrame={14} />
          </div>

          {/* Bottom: 30min Throughput & Latency Curve */}
          <div
            style={{
              opacity: curveSpring,
              transform: `scale(${curveSpring}) translateY(${(1 - curveSpring) * 30}px)`,
            }}
          >
            <CpeThroughputCurve startFrame={18} duration={65} />
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
          color: "rgba(255, 255, 255, 0.4)",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: 1.5,
        }}
      >
        <span>S.WHITE REVIEW BENCHMARK SYSTEM // 5G CPE BROADBAND REPLACEMENT TEST</span>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span>THROUGHPUT STABILITY: 99.8%</span>
          <span style={{ color: "#38EF7D" }}>● 5G GIGABIT READY</span>
        </div>
      </div>
    </div>
  );
};
