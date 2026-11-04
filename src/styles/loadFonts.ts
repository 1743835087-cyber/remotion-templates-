import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

let fontsPromise: Promise<void> | null = null;

export const ensureFontsLoaded = () => {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      loadFont({
        family: "Alibaba PuHuiTi",
        url: staticFile("fonts/AlibabaPuHuiTi-3-55-Regular.ttf"),
        weight: "400",
        format: "truetype",
      }),
      loadFont({
        family: "Alibaba PuHuiTi",
        url: staticFile("fonts/AlibabaPuHuiTi-3-65-Medium.ttf"),
        weight: "500",
        format: "truetype",
      }),
      loadFont({
        family: "Alibaba PuHuiTi",
        url: staticFile("fonts/AlibabaPuHuiTi-3-85-Bold.ttf"),
        weight: "700",
        format: "truetype",
      }),
      loadFont({
        family: "Alibaba PuHuiTi",
        url: staticFile("fonts/AlibabaPuHuiTi-3-105-Heavy.ttf"),
        weight: "900",
        format: "truetype",
      }),
    ]).then(() => undefined);
  }
  return fontsPromise;
};
