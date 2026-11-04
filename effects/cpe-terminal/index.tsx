import React, { useEffect, useState } from "react";
import { continueRender, delayRender, Series } from "remotion";
import { Background } from "../../src/components/Background";
import { Scene1Subversion } from "../../src/components/Scene1Subversion";
import { Scene2DeviceReveal } from "../../src/components/Scene2DeviceReveal";
import { Scene3Performance } from "../../src/components/Scene3Performance";
import { Scene4BentoGrid } from "../../src/components/Scene4BentoGrid";
import { Scene5Outro } from "../../src/components/Scene5Outro";
import { ensureFontsLoaded } from "../../src/styles/loadFonts";
import "../../src/styles/fonts.css";

// Initiate font loading immediately
ensureFontsLoaded();

export const CpeTerminalVideo: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading Alibaba PuHuiTi fonts"));

  useEffect(() => {
    ensureFontsLoaded()
      .then(() => {
        continueRender(handle);
      })
      .catch((err) => {
        console.error("Font loading error:", err);
        continueRender(handle);
      });
  }, [handle]);

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
      {/* Persistent Cinematic Backdrop */}
      <Background />

      {/* Sequential Narrative Scenes */}
      <Series>
        {/* Scene 1: Subverting the "Portable WiFi" Myth (0 - 3.5s) */}
        <Series.Sequence durationInFrames={105}>
          <Scene1Subversion />
        </Series.Sequence>

        {/* Scene 2: Hardware Reveal & Convection Cooling (3.5s - 7.17s) */}
        <Series.Sequence durationInFrames={110}>
          <Scene2DeviceReveal />
        </Series.Sequence>

        {/* Scene 3: Fiber Broadband Replacement & 980Mbps Speed Test (7.17s - 11.0s) */}
        <Series.Sequence durationInFrames={115}>
          <Scene3Performance />
        </Series.Sequence>

        {/* Scene 4: Multi-Scenario Bento Grid (11.0s - 14.67s) */}
        <Series.Sequence durationInFrames={110}>
          <Scene4BentoGrid />
        </Series.Sequence>

        {/* Scene 5: Outro Brand Lockup (14.67s - 18.0s) */}
        <Series.Sequence durationInFrames={100}>
          <Scene5Outro />
        </Series.Sequence>
      </Series>
    </div>
  );
};
