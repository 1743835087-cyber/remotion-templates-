import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Img,
} from "remotion";
import { Zap, Wifi, Shield } from "lucide-react";

export const Shot5OutroBrand: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrances
  const deviceSpring = spring({ frame, fps, config: { damping: 14, mass: 0.85 } });
  const textSpring = spring({ frame: frame - 10, fps, config: { damping: 14 } });
  const badgeSpring = spring({ frame: frame - 20, fps, config: { damping: 15 } });

  // Light flare sweep across the headline
  const shineOffset = interpolate(frame, [25, 70], [-130, 240], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const floatY = Math.sin(frame / 18) * 6;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 90px",
        gap: 60,
      }}
    >
      {/* Device Lockup on Left */}
      <div
        style={{
          position: "relative",
          width: 440,
          height: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: deviceSpring,
          transform: `scale(${deviceSpring}) translateY(${(1 - deviceSpring) * 40 + floatY}px)`,
          zIndex: 5,
        }}
      >
        {/* Soft shadow */}
        <div
          style={{
            position: "absolute",
            bottom: 25,
            width: 360,
            height: 60,
            background:
              "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.95) 0%, rgba(0, 229, 255, 0.12) 40%, transparent 75%)",
            borderRadius: "50%",
            filter: "blur(14px)",
          }}
        />

        {/* Brand aura circle */}
        <div
          style={{
            position: "absolute",
            width: 420,
            height: 420,
            borderRadius: "50%",
            border: "1.5px dashed rgba(0, 245, 255, 0.25)",
            transform: `rotate(${frame * 0.3}deg)`,
          }}
        />

        <Img
          src={staticFile("cpe_device.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.95))",
          }}
        />

        {/* Glowing LED lights */}
        <div
          style={{
            position: "absolute",
            top: "47%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "#00F5FF",
            boxShadow: "0 0 14px 6px rgba(0, 245, 255, 0.95)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "56.5%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 7,
            height: 7,
            borderRadius: "50%",
            backgroundColor: "#38EF7D",
            boxShadow: "0 0 10px 4px rgba(56, 239, 125, 0.9)",
          }}
        />
      </div>

      {/* Brand & Slogan Lockup on Right */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          maxWidth: 750,
          opacity: textSpring,
          transform: `translateX(${(1 - textSpring) * 50}px)`,
          zIndex: 10,
        }}
      >
        {/* Category Pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 22px",
            borderRadius: 22,
            background: "rgba(0, 245, 255, 0.14)",
            border: "1.5px solid rgba(0, 245, 255, 0.5)",
            color: "#00F5FF",
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 2,
            marginBottom: 20,
            boxShadow: "0 0 20px rgba(0, 245, 255, 0.25)",
          }}
        >
          <Zap size={20} fill="#00F5FF" />
          告别布线绑架 · 拥抱自由千兆
        </div>

        {/* Master Heading */}
        <h1
          style={{
            position: "relative",
            fontSize: 80,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: 4,
            lineHeight: 1.15,
            marginBottom: 18,
            overflow: "hidden",
          }}
        >
          新一代 5G 路由终端
          {/* Shine Sweep Overlay */}
          <span
            style={{
              position: "absolute",
              top: 0,
              left: `${shineOffset}%`,
              width: "40%",
              height: "100%",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.85) 50%, transparent 100%)",
              transform: "skewX(-25deg)",
              pointerEvents: "none",
            }}
          />
        </h1>

        {/* Big Slogan Subtitle */}
        <div
          style={{
            fontSize: 38,
            fontWeight: 800,
            letterSpacing: 4,
            background: "linear-gradient(90deg, #FFFFFF 0%, #00F5FF 50%, #38EF7D 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 34,
          }}
        >
          光纤宽带新物种 · 插上电就是真宽带
        </div>

        {/* 3 Core Guarantee Badges */}
        <div
          style={{
            display: "flex",
            gap: 16,
            opacity: badgeSpring,
            transform: `translateY(${(1 - badgeSpring) * 20}px)`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 20px",
              background: "rgba(255, 255, 255, 0.06)",
              border: "1.5px solid rgba(255, 255, 255, 0.18)",
              borderRadius: 14,
              color: "#E2E8F0",
              fontSize: 17,
              fontWeight: 700,
              boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
            }}
          >
            <Wifi size={20} color="#00F5FF" />
            免拉网线 · 即插即用
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 20px",
              background: "rgba(255, 255, 255, 0.06)",
              border: "1.5px solid rgba(255, 255, 255, 0.18)",
              borderRadius: 14,
              color: "#E2E8F0",
              fontSize: 17,
              fontWeight: 700,
              boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
            }}
          >
            <Zap size={20} color="#38EF7D" />
            千兆级超高吞吐
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 20px",
              background: "rgba(255, 255, 255, 0.06)",
              border: "1.5px solid rgba(255, 255, 255, 0.18)",
              borderRadius: 14,
              color: "#E2E8F0",
              fontSize: 17,
              fontWeight: 700,
              boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
            }}
          >
            <Shield size={20} color="#00F5FF" />
            7×24H 满载不降频
          </div>
        </div>
      </div>
    </div>
  );
};
