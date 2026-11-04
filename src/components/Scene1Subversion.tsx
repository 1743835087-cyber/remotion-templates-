import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AlertTriangle, Zap, ShieldAlert } from "lucide-react";

export const Scene1Subversion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Negative tags entrance (frames 0 - 40)
  const tagSpring1 = spring({ frame: frame - 5, fps, config: { damping: 14 } });
  const tagSpring2 = spring({ frame: frame - 12, fps, config: { damping: 14 } });
  const tagSpring3 = spring({ frame: frame - 18, fps, config: { damping: 14 } });
  const tagSpring4 = spring({ frame: frame - 24, fps, config: { damping: 14 } });

  // Phase 2: Electric laser slash & shatter (frames 38 - 55)
  const slashProgress = interpolate(frame, [38, 48], [-100, 110], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Shatter / explode fade out of negative tags
  const shatterOpacity = interpolate(frame, [42, 50], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shatterScale = interpolate(frame, [42, 52], [1, 1.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 3: Core Truth Hero Entrance (frames 46 - 105)
  const heroSpring = spring({
    frame: frame - 46,
    fps,
    config: { damping: 12, mass: 0.8, stiffness: 120 },
  });

  const heroSubSpring = spring({
    frame: frame - 58,
    fps,
    config: { damping: 14, mass: 0.6 },
  });

  const badgeSpring = spring({
    frame: frame - 68,
    fps,
    config: { damping: 15 },
  });

  // Phase 4: Exit transition push (frames 95 - 105)
  const exitScale = interpolate(frame, [92, 105], [1, 1.15], {
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
        transform: `scale(${exitScale})`,
        opacity: exitOpacity,
        overflow: "hidden",
      }}
    >
      {/* Laser slash effect */}
      {frame >= 38 && frame <= 65 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${slashProgress}%`,
            width: "50vw",
            height: 3,
            background:
              "linear-gradient(90deg, transparent 0%, #00F5FF 40%, #FFFFFF 60%, transparent 100%)",
            boxShadow:
              "0 0 25px 8px rgba(0, 245, 255, 0.9), 0 0 50px 15px rgba(255, 255, 255, 0.8)",
            transform: "translateY(-50%) rotate(-12deg)",
            zIndex: 30,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Negative Rumor Cloud (Phase 1) */}
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
            top: "28%",
            left: "22%",
            opacity: tagSpring1,
            transform: `scale(${tagSpring1}) translateY(${(1 - tagSpring1) * 30}px)`,
            padding: "12px 24px",
            borderRadius: 30,
            background: "rgba(255, 75, 75, 0.12)",
            border: "1px solid rgba(255, 75, 75, 0.4)",
            color: "#FF6B6B",
            fontSize: 24,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <AlertTriangle size={24} />
          随身WiFi = 容易发热降频？
        </div>

        {/* Tag 2 */}
        <div
          style={{
            position: "absolute",
            top: "32%",
            right: "20%",
            opacity: tagSpring2,
            transform: `scale(${tagSpring2}) translateY(${(1 - tagSpring2) * 30}px)`,
            padding: "12px 24px",
            borderRadius: 30,
            background: "rgba(255, 75, 75, 0.12)",
            border: "1px solid rgba(255, 75, 75, 0.4)",
            color: "#FF6B6B",
            fontSize: 24,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <ShieldAlert size={24} />
          玩具网速 · 虚标跑不满？
        </div>

        {/* Tag 3 */}
        <div
          style={{
            position: "absolute",
            bottom: "30%",
            left: "25%",
            opacity: tagSpring3,
            transform: `scale(${tagSpring3}) translateY(${(1 - tagSpring3) * 30}px)`,
            padding: "12px 24px",
            borderRadius: 30,
            background: "rgba(255, 120, 50, 0.12)",
            border: "1px solid rgba(255, 120, 50, 0.4)",
            color: "#FFA07A",
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          电池供电容易老化鼓包？
        </div>

        {/* Tag 4 */}
        <div
          style={{
            position: "absolute",
            bottom: "26%",
            right: "24%",
            opacity: tagSpring4,
            transform: `scale(${tagSpring4}) translateY(${(1 - tagSpring4) * 30}px)`,
            padding: "12px 24px",
            borderRadius: 30,
            background: "rgba(255, 120, 50, 0.12)",
            border: "1px solid rgba(255, 120, 50, 0.4)",
            color: "#FFA07A",
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          多设备连入瞬间卡死？
        </div>
      </div>

      {/* Phase 3: The Truth Core Reveal */}
      {frame >= 44 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            zIndex: 10,
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
              padding: "8px 22px",
              borderRadius: 20,
              background: "rgba(0, 245, 255, 0.12)",
              border: "1px solid rgba(0, 245, 255, 0.45)",
              color: "#00F5FF",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 2,
              marginBottom: 24,
            }}
          >
            <Zap size={20} fill="#00F5FF" />
            打破误区 · 重新定义
          </div>

          {/* Heavy Hero Title */}
          <h1
            style={{
              opacity: heroSpring,
              transform: `scale(${heroSpring})`,
              fontSize: 86,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: 4,
              lineHeight: 1.15,
              textShadow:
                "0 0 30px rgba(0, 245, 255, 0.35), 0 10px 40px rgba(0,0,0,0.8)",
              marginBottom: 24,
            }}
          >
            它，<span style={{ color: "#FF4D4F" }}>绝非</span> 随身WiFi
          </h1>

          {/* Subtitle Positioning */}
          <div
            style={{
              opacity: heroSubSpring,
              transform: `translateY(${(1 - heroSubSpring) * 30}px)`,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 60,
                height: 2,
                background:
                  "linear-gradient(90deg, transparent, #00F5FF)",
              }}
            />
            <h2
              style={{
                fontSize: 42,
                fontWeight: 700,
                letterSpacing: 6,
                background:
                  "linear-gradient(90deg, #FFFFFF 0%, #00F5FF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              宽带的终极替代品 · 5G 路由终端
            </h2>
            <div
              style={{
                width: 60,
                height: 2,
                background:
                  "linear-gradient(90deg, #00F5FF, transparent)",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
