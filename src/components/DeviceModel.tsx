import React from "react";
import {
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Img,
} from "remotion";

interface DeviceModelProps {
  scale?: number;
  translateY?: number;
  translateX?: number;
  showScanningLine?: boolean;
  showAura?: boolean;
  activeLeds?: boolean;
}

export const DeviceModel: React.FC<DeviceModelProps> = ({
  scale = 1,
  translateY = 0,
  translateX = 0,
  showScanningLine = false,
  showAura = true,
  activeLeds = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle floating motion
  const floatY = Math.sin(frame / 18) * 8;
  const floatTilt = Math.sin(frame / 25) * 1.5;

  // LED pulsating glows
  const ledGlow5G = activeLeds
    ? interpolate(Math.sin((frame + 0) / 8), [-1, 1], [0.6, 1])
    : 0.1;
  const ledGlow4G = activeLeds
    ? interpolate(Math.sin((frame + 5) / 9), [-1, 1], [0.5, 0.9])
    : 0.1;
  const ledGlowWifi = activeLeds
    ? interpolate(Math.sin((frame + 10) / 7), [-1, 1], [0.7, 1])
    : 0.1;
  const ledGlowPower = activeLeds ? 1 : 0.2;

  // Scanning laser beam
  const scanProgress = interpolate((frame * 2.5) % 120, [0, 120], [-180, 200]);

  // Airflow convection wave
  const airWave1 = (frame * 2) % 60;
  const airOpacity1 = interpolate(airWave1, [0, 30, 60], [0, 0.8, 0]);
  const airY1 = interpolate(airWave1, [0, 60], [0, -45]);

  return (
    <div
      style={{
        position: "relative",
        width: 480,
        height: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `translate(${translateX}px, ${translateY + floatY}px) scale(${scale}) rotate(${floatTilt}deg)`,
        transformOrigin: "center center",
        pointerEvents: "none",
      }}
    >
      {/* Soft ground shadow / spotlight on table */}
      <div
        style={{
          position: "absolute",
          bottom: 25,
          width: 380,
          height: 60,
          background:
            "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.8) 0%, rgba(0, 229, 255, 0.08) 40%, transparent 75%)",
          borderRadius: "50%",
          filter: "blur(12px)",
        }}
      />

      {/* Cyber energy aura rings behind device */}
      {showAura && (
        <>
          <div
            style={{
              position: "absolute",
              width: 420,
              height: 420,
              borderRadius: "50%",
              border: "1px dashed rgba(0, 229, 255, 0.25)",
              transform: `rotate(${frame * 0.4}deg)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 500,
              height: 500,
              borderRadius: "50%",
              border: "1px dotted rgba(0, 229, 255, 0.15)",
              transform: `rotate(${-frame * 0.25}deg)`,
            }}
          />
        </>
      )}

      {/* Main Device Image Container */}
      <div
        style={{
          position: "relative",
          width: 360,
          height: 520,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "visible",
        }}
      >
        <Img
          src={staticFile("cpe_device.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.9))",
          }}
        />

        {/* Dynamic LEDs Overlays aligned with device panel */}
        {/* 5G Status LED Light */}
        <div
          style={{
            position: "absolute",
            top: "47%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 7,
            height: 7,
            borderRadius: "50%",
            backgroundColor: "#00F5FF",
            boxShadow: `0 0 10px 4px rgba(0, 245, 255, ${ledGlow5G * 0.9}), 0 0 20px 8px rgba(0, 229, 255, ${ledGlow5G * 0.5})`,
            opacity: ledGlow5G,
          }}
        />

        {/* 4G Status LED Light */}
        <div
          style={{
            position: "absolute",
            top: "51.8%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: "#00E5FF",
            boxShadow: `0 0 8px 3px rgba(0, 229, 255, ${ledGlow4G * 0.8})`,
            opacity: ledGlow4G,
          }}
        />

        {/* WiFi Status LED Light */}
        <div
          style={{
            position: "absolute",
            top: "56.5%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: "#38EF7D",
            boxShadow: `0 0 8px 3px rgba(56, 239, 125, ${ledGlowWifi * 0.8})`,
            opacity: ledGlowWifi,
          }}
        />

        {/* Power LED Light */}
        <div
          style={{
            position: "absolute",
            top: "61.2%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: "#00F5FF",
            boxShadow: `0 0 6px 2px rgba(0, 245, 255, ${ledGlowPower * 0.7})`,
            opacity: ledGlowPower,
          }}
        />

        {/* Top Vent Convection Airflow Rings */}
        <div
          style={{
            position: "absolute",
            top: 48,
            left: "50%",
            transform: `translateX(-50%) translateY(${airY1}px)`,
            width: 140,
            height: 22,
            border: "1.5px solid rgba(0, 229, 255, 0.7)",
            borderRadius: "50%",
            opacity: airOpacity1,
            filter: "blur(0.8px)",
          }}
        />

        {/* Scanning Laser Sweep Effect */}
        {showScanningLine && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "15%",
              width: "70%",
              height: 2,
              background:
                "linear-gradient(90deg, transparent 0%, #00F5FF 50%, transparent 100%)",
              boxShadow: "0 0 16px 4px rgba(0, 245, 255, 0.8)",
              transform: `translateY(${scanProgress}px)`,
              opacity: 0.85,
            }}
          />
        )}
      </div>
    </div>
  );
};
