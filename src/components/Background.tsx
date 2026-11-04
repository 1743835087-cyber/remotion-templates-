import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Subtle breathing of the spotlight
  const lightPulse = interpolate(
    Math.sin(frame / 20),
    [-1, 1],
    [0.85, 1.05]
  );

  return (
    <div
      style={{
        position: "absolute",
        width,
        height,
        backgroundColor: "#070A0F",
        backgroundImage: `
          radial-gradient(circle at 50% 40%, rgba(20, 35, 60, ${0.45 * lightPulse}) 0%, rgba(7, 10, 15, 0.95) 75%),
          linear-gradient(180deg, #05070B 0%, #080D15 50%, #05070B 100%)
        `,
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {/* Tabletop Spotlight Ellipse (matching the physical device lighting in photo) */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "12%",
          width: 900,
          height: 280,
          transform: "translateX(-50%)",
          background: `radial-gradient(ellipse at center, rgba(235, 245, 255, ${0.18 * lightPulse}) 0%, rgba(0, 210, 255, 0.05) 45%, transparent 70%)`,
          borderRadius: "50%",
          filter: "blur(20px)",
        }}
      />

      {/* Cyber Grid Lines */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.12,
        }}
      >
        <defs>
          <pattern
            id="cyber-grid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="#00E5FF"
              strokeWidth="0.8"
            />
            <circle cx="0" cy="0" r="1.5" fill="#00E5FF" opacity="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cyber-grid)" />
      </svg>

      {/* Horizon glow divider */}
      <div
        style={{
          position: "absolute",
          left: "10%",
          right: "10%",
          bottom: "22%",
          height: 1,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0, 229, 255, 0.3) 50%, transparent 100%)",
          boxShadow: "0 0 15px rgba(0, 229, 255, 0.4)",
        }}
      />
    </div>
  );
};
