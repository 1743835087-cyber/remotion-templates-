import { Config } from "@remotion/cli/config";

// Use lossless PNG for intermediate frames to prevent any compression blur
Config.setVideoImageFormat("png");
Config.setOverwriteOutput(true);
Config.setPixelFormat("yuv420p");
