import React, { useEffect, useState } from "react";
import {
  Audio,
  continueRender,
  delayRender,
  interpolate,
  Series,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Background } from "../../src/components/Background";
import { Shot1Disruption } from "./Shot1Disruption";
import { Shot2HardwareHero } from "./Shot2HardwareHero";
import { Shot3XiaobaiBench } from "./Shot3XiaobaiBench";
import { Shot4DeckDealScenarios } from "./Shot4DeckDealScenarios";
import { Shot5OutroBrand } from "./Shot5OutroBrand";
import { ensureFontsLoaded } from "../../src/styles/loadFonts";
import "../../src/styles/fonts.css";

// Ensure Alibaba PuHuiTi fonts are loaded
ensureFontsLoaded();

export const CpeShotcraftPromo: React.FC = () => {
  const frame = useCurrentFrame();
  const [handle] = useState(() => delayRender("Loading fonts for CpeShotcraftPromo"));

  useEffect(() => {
    ensureFontsLoaded()
      .then(() => continueRender(handle))
      .catch((err) => {
        console.error("Font loading error:", err);
        continueRender(handle);
      });
  }, [handle]);

  // Audio volume automation curve (fade in over 15 frames, full volume, fade out over last 30 frames)
  const audioVolume = interpolate(
    frame,
    [0, 15, 510, 540],
    [0, 0.85, 0.85, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "#070A0F",
        overflow: "hidden",
        fontFamily: "'Alibaba PuHuiTi', sans-serif",
      }}
    >
      {/* Dynamic Background Soundtrack with Beat Sync from video-shotcraft */}
      <Audio
        src={staticFile("bgm-tech-house.mp3")}
        volume={audioVolume}
      />

      {/* Persistent Cinematic Dark Industrial Backdrop */}
      <Background />

      {/* 5-Shot Sequential Pipeline Breakdown */}
      <Series>
        {/* Shot 1: Disruption (0 - 105f / 3.5s) */}
        <Series.Sequence durationInFrames={105}>
          <Shot1Disruption />
        </Series.Sequence>

        {/* Shot 2: Hardware Hero & Airflow Convection (105 - 215f / 3.67s) */}
        <Series.Sequence durationInFrames={110}>
          <Shot2HardwareHero />
        </Series.Sequence>

        {/* Shot 3: Xiaobai Benchmark HUD - 5G CPE 986.5 Mbps & Fiber Stability Curve (215 - 330f / 3.83s) */}
        <Series.Sequence durationInFrames={115}>
          <Shot3XiaobaiBench />
        </Series.Sequence>

        {/* Shot 4: 3D Deck-Deal Bento Scenarios (330 - 440f / 3.67s) */}
        <Series.Sequence durationInFrames={110}>
          <Shot4DeckDealScenarios />
        </Series.Sequence>

        {/* Shot 5: Outro Brand Lockup & Light Sweep (440 - 540f / 3.33s) */}
        <Series.Sequence durationInFrames={100}>
          <Shot5OutroBrand />
        </Series.Sequence>
      </Series>
    </div>
  );
};
