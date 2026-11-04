import React, { useEffect, useState } from "react";
import {
  continueRender,
  delayRender,
  useVideoConfig,
} from "remotion";
import { Shot3XiaobaiBench } from "../Shot3XiaobaiBench";
import { ensureFontsLoaded } from "../../../src/styles/loadFonts";
import "../../../src/styles/fonts.css";

ensureFontsLoaded();

export const StandaloneCpeBenchmark: React.FC = () => {
  const { width, height } = useVideoConfig();
  const [handle] = useState(() => delayRender("Loading fonts for StandaloneCpeBenchmark"));

  useEffect(() => {
    ensureFontsLoaded()
      .then(() => continueRender(handle))
      .catch((err) => {
        console.error("Font loading error:", err);
        continueRender(handle);
      });
  }, [handle]);

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        backgroundColor: "#070A0F",
        backgroundImage: `
          radial-gradient(circle at 50% 45%, rgba(15, 25, 40, 0.5) 0%, rgba(7, 10, 15, 0.98) 75%),
          linear-gradient(180deg, #05070B 0%, #080D14 50%, #05070B 100%)
        `,
        overflow: "hidden",
        fontFamily: "'Alibaba PuHuiTi', sans-serif",
      }}
    >
      <Shot3XiaobaiBench isStandalone={true} />
    </div>
  );
};
