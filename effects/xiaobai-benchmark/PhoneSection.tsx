import React from "react";
import {
  interpolate,
  staticFile,
  useCurrentFrame,
  Img,
} from "remotion";

export const PhoneSection: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle natural hand breathing motion
  const floatY = Math.sin(frame / 20) * 4;

  return (
    <div
      style={{
        width: 360,
        height: 520,
        backgroundColor: "rgba(10, 14, 20, 0.85)",
        border: "1px solid rgba(255, 255, 255, 0.16)",
        borderRadius: 8,
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
      }}
    >
      {/* OnePlus Device Badge */}
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
        }}
      >
        {/* OnePlus Square Logo */}
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
          1+ ONEPLUS
        </div>
        <span
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: "#FFFFFF",
            letterSpacing: 1,
          }}
        >
          一加 Ace 7
        </span>
      </div>

      {/* Phone in Hand Image */}
      <div
        style={{
          position: "relative",
          width: 310,
          height: 420,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${floatY}px)`,
        }}
      >
        {/* Subtle glow behind phone */}
        <div
          style={{
            position: "absolute",
            width: 240,
            height: 300,
            background:
              "radial-gradient(circle, rgba(255, 90, 0, 0.15) 0%, rgba(0, 229, 255, 0.08) 50%, transparent 75%)",
            filter: "blur(24px)",
            borderRadius: "50%",
          }}
        />

        <Img
          src={staticFile("phone_hand_hd.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: "drop-shadow(0 15px 35px rgba(0, 0, 0, 0.9))",
            imageRendering: "auto",
          }}
        />
      </div>
    </div>
  );
};
