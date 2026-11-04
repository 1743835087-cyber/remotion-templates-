import React from "react";
import {
  interpolate,
  staticFile,
  useCurrentFrame,
  Img,
} from "remotion";
import { Radio } from "lucide-react";

export const CpeDeviceSection: React.FC = () => {
  const frame = useCurrentFrame();

  // Gentle natural breathing float
  const floatY = Math.sin(frame / 18) * 3;

  // LED pulsating glows
  const ledGlow5G = interpolate(Math.sin(frame / 6), [-1, 1], [0.75, 1]);
  const ledGlowWifi = interpolate(Math.sin((frame + 4) / 7), [-1, 1], [0.8, 1]);

  // Expanding 5G wave ring radiating from the top antenna array
  const waveProgress = (frame * 1.8) % 45;
  const waveRadius = interpolate(waveProgress, [0, 45], [15, 85]);
  const waveOpacity = interpolate(waveProgress, [0, 20, 45], [0.85, 0.45, 0]);

  return (
    <div
      style={{
        width: 360,
        height: 520,
        backgroundColor: "rgba(10, 14, 20, 0.88)",
        border: "1px solid rgba(0, 245, 255, 0.22)",
        borderRadius: 8,
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(0, 245, 255, 0.05)",
      }}
    >
      {/* Top Device Model Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "6px 14px",
          borderRadius: 4,
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          marginTop: 4,
          zIndex: 5,
        }}
      >
        {/* 5G Red/Orange Badge Box */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2px 6px",
            border: "1.5px solid #FF3B30",
            borderRadius: 3,
            color: "#FF3B30",
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: 0.5,
          }}
        >
          5G
        </div>

        {/* Model Name */}
        <span
          style={{
            color: "#FFFFFF",
            fontSize: 18,
            fontWeight: 900,
            letterSpacing: 1,
          }}
        >
          5G CPE Pro 旗舰路由
        </span>
      </div>

      {/* Center Hero: High-Res Cutout Router Standing Vertically */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 395,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${floatY}px)`,
        }}
      >
        {/* Tabletop Spotlight Reflection & Ambient Shadow */}
        <div
          style={{
            position: "absolute",
            bottom: 18,
            width: 250,
            height: 48,
            background:
              "radial-gradient(ellipse at center, rgba(0, 245, 255, 0.35) 0%, rgba(255, 179, 0, 0.2) 35%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(10px)",
          }}
        />

        {/* Top 5G Expanding Radio Wave Ring */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: "50%",
            width: waveRadius * 2,
            height: waveRadius * 0.75,
            borderRadius: "50%",
            border: "1.5px solid #00F5FF",
            opacity: waveOpacity,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        />

        {/* Prominent High-Def Isolated Router Device */}
        <div
          style={{
            position: "relative",
            width: 175,
            height: 360,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Img
            src={staticFile("cpe_device_hd.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter: "drop-shadow(0 15px 30px rgba(0, 0, 0, 0.95))",
            }}
          />

          {/* Micro Status LEDs Precisely Aligned on the Router Body */}
          {/* 5G Status LED */}
          <div
            style={{
              position: "absolute",
              top: "48%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 3.5,
              height: 3.5,
              borderRadius: "50%",
              backgroundColor: "#00F5FF",
              boxShadow: `0 0 6px 2px rgba(0, 245, 255, ${ledGlow5G}), 0 0 12px 5px rgba(0, 229, 255, 0.5)`,
            }}
          />

          {/* 4G Status LED */}
          <div
            style={{
              position: "absolute",
              top: "56%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 3.5,
              height: 3.5,
              borderRadius: "50%",
              backgroundColor: "#FFB300",
              boxShadow: "0 0 5px 2px rgba(255, 179, 0, 0.8)",
            }}
          />

          {/* Wi-Fi Status LED */}
          <div
            style={{
              position: "absolute",
              top: "64%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 3.5,
              height: 3.5,
              borderRadius: "50%",
              backgroundColor: "#38EF7D",
              boxShadow: `0 0 6px 2px rgba(56, 239, 125, ${ledGlowWifi})`,
            }}
          />

          {/* Power Status LED */}
          <div
            style={{
              position: "absolute",
              top: "72%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 3.5,
              height: 3.5,
              borderRadius: "50%",
              backgroundColor: "#FFFFFF",
              boxShadow: "0 0 4px 1.5px rgba(255, 255, 255, 0.9)",
            }}
          />
        </div>
      </div>

      {/* Bottom Status Info Pill */}
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 12px",
          borderRadius: 4,
          background: "rgba(0, 245, 255, 0.08)",
          border: "1px solid rgba(0, 245, 255, 0.2)",
          fontSize: 12,
          fontWeight: 700,
          color: "#E0E8F0",
          zIndex: 5,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Radio size={14} color="#00F5FF" />
          5G SA 独立组网
        </span>
        <span style={{ color: "#38EF7D", display: "flex", alignItems: "center", gap: 4 }}>
          ● 64台满载
        </span>
      </div>
    </div>
  );
};
