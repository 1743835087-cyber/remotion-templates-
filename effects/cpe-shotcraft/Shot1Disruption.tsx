import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { AlertTriangle, Zap, ShieldAlert, WifiOff } from "lucide-react";
import { FlashCut } from "../../src/lib/FlashCut";

export const Shot1Disruption: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Rumor tags staggered pop-in (frames 0 - 36)
  const tagSpring1 = spring({ frame: frame - 4, fps, config: { damping: 14, mass: 0.8 } });
  const tagSpring2 = spring({ frame: frame - 10, fps, config: { damping: 14, mass: 0.8 } });
  const tagSpring3 = spring({ frame: frame - 16, fps, config: { damping: 14, mass: 0.8 } });
  const tagSpring4 = spring({ frame: frame - 22, fps, config: { damping: 14, mass: 0.8 } });

  // Phase 2: Laser Slash & Glitch Shatter (frames 36 - 48)
  const slashX = interpolate(frame, [36, 46], [-120, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const shatterOpacity = interpolate(frame, [40, 48], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const shatterScale = interpolate(frame, [40, 48], [1, 1.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Camera Shake on impact (frame 44)
  const isImpact = frame >= 44 && frame <= 50;
  const shakeX = isImpact ? (Math.sin(frame * 9) * 12) : 0;
  const shakeY = isImpact ? (Math.cos(frame * 11) * 8) : 0;

  // Phase 3: Core Slam Title Entrance (frames 44 - 105)
  const heroSpring = spring({
    frame: frame - 44,
    fps,
    config: { damping: 11, mass: 0.9, stiffness: 140 }, // High-energy slam overshoot
  });

  const subSpring = spring({
    frame: frame - 56,
    fps,
    config: { damping: 14, mass: 0.7 },
  });

  const badgeSpring = spring({
    frame: frame - 66,
    fps,
    config: { damping: 15 },
  });

  // Outro transition push (frames 95 - 105)
  const exitScale = interpolate(frame, [95, 105], [1, 1.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const exitOpacity = interpolate(frame, [98, 105], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: `translate(${shakeX}px, ${shakeY}px) scale(${exitScale})`,
        opacity: exitOpacity,
        overflow: "hidden",
      }}
    >
      {/* High-speed White Flash Impact Cut at frame 44 */}
      <Sequence from={44} durationInFrames={10}>
        <FlashCut duration={10} />
      </Sequence>

      {/* Cyber Laser Slash Line */}
      {frame >= 36 && frame <= 58 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${slashX}%`,
            width: "60vw",
            height: 4,
            background:
              "linear-gradient(90deg, transparent 0%, #00F5FF 40%, #FFFFFF 60%, transparent 100%)",
            boxShadow:
              "0 0 30px 10px rgba(0, 245, 255, 0.95), 0 0 60px 20px rgba(255, 255, 255, 0.9)",
            transform: "translateY(-50%) rotate(-14deg)",
            zIndex: 40,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Negative Misconception Tags (Phase 1) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: shatterOpacity,
          transform: `scale(${shatterScale})`,
          pointerEvents: "none",
        }}
      >
        {/* Tag 1 */}
        <div
          style={{
            position: "absolute",
            top: "26%",
            left: "18%",
            opacity: tagSpring1,
            transform: `scale(${tagSpring1}) translateY(${(1 - tagSpring1) * 30}px) rotate(-3deg)`,
            padding: "14px 28px",
            borderRadius: 30,
            background: "rgba(255, 75, 75, 0.15)",
            border: "1.5px solid rgba(255, 75, 75, 0.5)",
            color: "#FF5C5C",
            fontSize: 26,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: 12,
            boxShadow: "0 8px 24px rgba(255, 75, 75, 0.2)",
          }}
        >
          <AlertTriangle size={28} />
          随身WiFi = 发热降频断连？
        </div>

        {/* Tag 2 */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            right: "16%",
            opacity: tagSpring2,
            transform: `scale(${tagSpring2}) translateY(${(1 - tagSpring2) * 30}px) rotate(2deg)`,
            padding: "14px 28px",
            borderRadius: 30,
            background: "rgba(255, 75, 75, 0.15)",
            border: "1.5px solid rgba(255, 75, 75, 0.5)",
            color: "#FF5C5C",
            fontSize: 26,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: 12,
            boxShadow: "0 8px 24px rgba(255, 75, 75, 0.2)",
          }}
        >
          <WifiOff size={28} />
          玩具网速 · 虚标跑不满？
        </div>

        {/* Tag 3 */}
        <div
          style={{
            position: "absolute",
            bottom: "28%",
            left: "22%",
            opacity: tagSpring3,
            transform: `scale(${tagSpring3}) translateY(${(1 - tagSpring3) * 30}px) rotate(1.5deg)`,
            padding: "14px 28px",
            borderRadius: 30,
            background: "rgba(255, 120, 50, 0.15)",
            border: "1.5px solid rgba(255, 120, 50, 0.5)",
            color: "#FFA07A",
            fontSize: 24,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <ShieldAlert size={26} />
          电池老化 · 鼓包安全隐患？
        </div>

        {/* Tag 4 */}
        <div
          style={{
            position: "absolute",
            bottom: "24%",
            right: "20%",
            opacity: tagSpring4,
            transform: `scale(${tagSpring4}) translateY(${(1 - tagSpring4) * 30}px) rotate(-2deg)`,
            padding: "14px 28px",
            borderRadius: 30,
            background: "rgba(255, 120, 50, 0.15)",
            border: "1.5px solid rgba(255, 120, 50, 0.5)",
            color: "#FFA07A",
            fontSize: 24,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          设备一多 · 游戏卡死飘红？
        </div>
      </div>

      {/* Phase 3: The Truth Core Reveal (SLAM ENTRANCE) */}
      {frame >= 43 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            zIndex: 20,
          }}
        >
          {/* Top Category Badge */}
          <div
            style={{
              opacity: badgeSpring,
              transform: `scale(${badgeSpring}) translateY(${(1 - badgeSpring) * 20}px)`,
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 24px",
              borderRadius: 24,
              background: "rgba(0, 245, 255, 0.15)",
              border: "1.5px solid rgba(0, 245, 255, 0.6)",
              color: "#00F5FF",
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: 2,
              marginBottom: 24,
              boxShadow: "0 0 20px rgba(0, 245, 255, 0.25)",
            }}
          >
            <Zap size={22} fill="#00F5FF" />
            打破误区 · 彻底颠覆
          </div>

          {/* Heavy Hero Title (Slam Overshoot) */}
          <h1
            style={{
              opacity: heroSpring,
              transform: `scale(${heroSpring})`,
              fontSize: 92,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: 4,
              lineHeight: 1.1,
              textShadow:
                "0 0 40px rgba(0, 245, 255, 0.45), 0 15px 50px rgba(0,0,0,0.9)",
              marginBottom: 26,
            }}
          >
            它，<span style={{ color: "#FF4D4F" }}>绝非</span> 随身WiFi
          </h1>

          {/* Subtitle Positioning */}
          <div
            style={{
              opacity: subSpring,
              transform: `translateY(${(1 - subSpring) * 35}px)`,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div
              style={{
                width: 70,
                height: 3,
                background: "linear-gradient(90deg, transparent, #00F5FF)",
              }}
            />
            <h2
              style={{
                fontSize: 44,
                fontWeight: 800,
                letterSpacing: 6,
                background: "linear-gradient(90deg, #FFFFFF 0%, #00F5FF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              光纤宽带的终极替代品 · 5G 路由终端
            </h2>
            <div
              style={{
                width: 70,
                height: 3,
                background: "linear-gradient(90deg, #00F5FF, transparent)",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
