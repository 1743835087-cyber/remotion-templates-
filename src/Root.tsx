import React from "react";
import { Composition, Folder } from "remotion";
import {
  KineticEditorialDark,
  KineticEditorialLight,
  KINETIC_EDITORIAL_DURATION,
} from "../effects/kinetic-editorial";
import {
  VerticalWordRollBlurCycle,
  VerticalWordRollCpeTech,
  VERTICAL_WORD_ROLL_BLUR_CYCLE_DURATION,
} from "../effects/vertical-word-roll-blur-cycle";
import {
  RhythmicDisruptionAnimation,
  RHYTHMIC_DISRUPTION_DURATION,
} from "../effects/rhythmic-disruption";
import {
  TypeEntranceGravityDark,
  TypeEntranceGravityLight,
  TypeEntranceChinese,
  TypeEntranceGuofengDark,
  TypeEntranceGuofengLight,
  TypeEntranceDisrupt,
  TYPE_ENTRANCE_MOVES_DURATION,
  GUOFENG_DURATION,
} from "../effects/type-entrance-moves";
import { CpeShotcraftPromo } from "../effects/cpe-shotcraft";
import { CpePromoFull } from "../effects/cpe-shotcraft/CpePromoFull";
import { StandaloneCpeBenchmark } from "../effects/cpe-shotcraft/cpe-bench/StandaloneCpeBenchmark";
import { XiaobaiBenchmark } from "../effects/xiaobai-benchmark";
import { CpeTerminalVideo } from "../effects/cpe-terminal";
import { TestAnimation } from "../effects/test-animation";
import { PhoneSpecBoard, PHONE_SPEC_DURATION } from "../effects/phone-spec-board";
import {
  PocketWifiBoard,
  POCKET_WIFI_DURATION,
  defaultPocketWifiProps,
} from "../effects/pocket-wifi-board";
import {
  ZteU30AirSpecBoard,
  ZTE_U30AIR_SPEC_DURATION,
  defaultZteU30AirProps,
} from "../effects/zte-u30air-spec";
import {
  MechaCaption,
  MECHA_CAPTION_DURATION,
  defaultMechaCaptionProps,
  speedCaptionProps,
  thermalCaptionProps,
} from "../effects/mecha-caption";
import {
  HardwareTriPillars,
  HARDWARE_TRI_PILLARS_DURATION,
  defaultHardwareTriPillarsProps,
  defaultRedCapTriPillarsProps,
  RedCapComparisonShowcase,
  defaultRedCapShowcaseProps,
} from "../effects/hardware-tri-pillars";
import {
  TechGridTitle,
  TECH_GRID_TITLE_DURATION,
  defaultTechGridTitleProps,
} from "../effects/tech-grid-title";

export const Root: React.FC = () => {
  return (
    <>
      <Folder name="TechGridTitle">
        {/* 科技取景器网格逐字下砸标题卡片模板 (60 FPS 电影级丝滑，透明通道) */}
        <Composition
          id="TechGridTitle"
          component={TechGridTitle}
          durationInFrames={TECH_GRID_TITLE_DURATION}
          fps={60}
          width={1920}
          height={1080}
          defaultProps={defaultTechGridTitleProps}
        />
        {/* 实景机模对比演示版 */}
        <Composition
          id="TechGridTitlePreview"
          component={TechGridTitle}
          durationInFrames={TECH_GRID_TITLE_DURATION}
          fps={60}
          width={1920}
          height={1080}
          defaultProps={{
            ...defaultTechGridTitleProps,
            previewFootageBackground: true,
          }}
        />
      </Folder>

      <Folder name="Captions">
        {/* 机甲斜切风口播文字卡片（透明背景，可叠加口播视频，4s @ 30fps） */}
        <Composition
          id="MechaCaption"
          component={MechaCaption}
          durationInFrames={MECHA_CAPTION_DURATION}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={defaultMechaCaptionProps}
        />
        <Composition
          id="MechaCaptionSpeed"
          component={MechaCaption}
          durationInFrames={MECHA_CAPTION_DURATION}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={speedCaptionProps}
        />
        <Composition
          id="MechaCaptionThermal"
          component={MechaCaption}
          durationInFrames={MECHA_CAPTION_DURATION}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={thermalCaptionProps}
        />
      </Folder>

      <Folder name="Typography">
        {/* Modern Swiss Kinetic Editorial - Dark Slate & Vermilion (8.0s @ 30fps) */}
        <Composition
          id="KineticEditorialDark"
          component={KineticEditorialDark}
          durationInFrames={KINETIC_EDITORIAL_DURATION}
          fps={30}
          width={1920}
          height={1080}
        />

        {/* Modern Swiss Kinetic Editorial - Warm Paper & Swiss Red (8.0s @ 30fps) */}
        <Composition
          id="KineticEditorialLight"
          component={KineticEditorialLight}
          durationInFrames={KINETIC_EDITORIAL_DURATION}
          fps={30}
          width={1920}
          height={1080}
        />
        {/* Kinetic Beat-Synced Word Roll: BUILT TO DISRUPT (8.67s @ 30fps) */}
        <Composition
          id="RhythmicWordRollDisruption"
          component={RhythmicDisruptionAnimation}
          durationInFrames={RHYTHMIC_DISRUPTION_DURATION}
          fps={30}
          width={1920}
          height={1080}
        />

        {/* video-shotcraft: vertical-word-roll-blur-cycle (5s @ 30fps) */}
        <Composition
          id="VerticalWordRollBlurCycle"
          component={VerticalWordRollBlurCycle}
          durationInFrames={VERTICAL_WORD_ROLL_BLUR_CYCLE_DURATION}
          fps={30}
          width={1920}
          height={1080}
        />

        {/* 5G CPE Tech Preset */}
        <Composition
          id="VerticalWordRollCpeTech"
          component={VerticalWordRollCpeTech}
          durationInFrames={VERTICAL_WORD_ROLL_BLUR_CYCLE_DURATION}
          fps={30}
          width={1920}
          height={1080}
        />

        {/* type-entrance-moves: Flagship Gravity Dark (5s @ 30fps) */}
        <Composition
          id="TypeEntranceGravityDark"
          component={TypeEntranceGravityDark}
          durationInFrames={TYPE_ENTRANCE_MOVES_DURATION}
          fps={30}
          width={1920}
          height={1080}
        />

        {/* type-entrance-moves: Swiss Editorial Light (5s @ 30fps) */}
        <Composition
          id="TypeEntranceGravityLight"
          component={TypeEntranceGravityLight}
          durationInFrames={TYPE_ENTRANCE_MOVES_DURATION}
          fps={30}
          width={1920}
          height={1080}
        />

        {/* type-entrance-moves: 国风汉字觉醒版 - 玄墨暗金 (5s @ 30fps) */}
        <Composition
          id="TypeEntranceGuofengDark"
          component={TypeEntranceGuofengDark}
          durationInFrames={GUOFENG_DURATION}
          fps={30}
          width={1920}
          height={1080}
        />

        {/* type-entrance-moves: 国风汉字觉醒版 - 素宣朱砂 (5s @ 30fps) */}
        <Composition
          id="TypeEntranceGuofengLight"
          component={TypeEntranceGuofengLight}
          durationInFrames={GUOFENG_DURATION}
          fps={30}
          width={1920}
          height={1080}
        />

        {/* type-entrance-moves: Hanzi Kinetic Chinese (兼容旧别名 5s @ 30fps) */}
        <Composition
          id="TypeEntranceChinese"
          component={TypeEntranceChinese}
          durationInFrames={TYPE_ENTRANCE_MOVES_DURATION}
          fps={30}
          width={1920}
          height={1080}
        />

        {/* type-entrance-moves: Disrupt Tech Breakthrough (5s @ 30fps) */}
        <Composition
          id="TypeEntranceDisrupt"
          component={TypeEntranceDisrupt}
          durationInFrames={TYPE_ENTRANCE_MOVES_DURATION}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      <Folder name="Effects">
        {/* 极力猫 5G RedCap 随身WiFi：左设备右三层对比卡片模板 (满血5G vs RedCap轻量化5G vs 传统4G, 1080P, 8s @ 30fps) */}
        <Composition
          id="RedCapShowcase"
          component={RedCapComparisonShowcase}
          durationInFrames={HARDWARE_TRI_PILLARS_DURATION}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={defaultRedCapShowcaseProps}
        />
        {/* 极力猫 5G RedCap 随身WiFi：三栏式硬件科普卡片模板 (1.轻量化5G / 2.功耗锐减 / 3.告别卡顿, 1080P, 8s @ 30fps) */}
        <Composition
          id="RedCapTriPillars"
          component={HardwareTriPillars}
          durationInFrames={HARDWARE_TRI_PILLARS_DURATION}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={defaultRedCapTriPillarsProps}
        />
        {/* 极客湾风格：三栏硬件科普动效 (1.电池容量 / 2.芯片能效 / 3.系统调度, 1080P, 8s @ 30fps) */}
        <Composition
          id="HardwareTriPillars"
          component={HardwareTriPillars}
          durationInFrames={HARDWARE_TRI_PILLARS_DURATION}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={defaultHardwareTriPillarsProps}
        />
        {/* 中兴 U30 Air 5G 随身 WiFi 规格资费展示模板 (4K 3840x2160, 8s @ 30fps) */}
        <Composition
          id="ZteU30AirSpec"
          component={ZteU30AirSpecBoard}
          durationInFrames={ZTE_U30AIR_SPEC_DURATION}
          fps={30}
          width={3840}
          height={2160}
          defaultProps={defaultZteU30AirProps}
        />
        <Composition id="PhoneSpecBoard" component={PhoneSpecBoard} durationInFrames={PHONE_SPEC_DURATION} fps={30} width={1920} height={1080}/>
        {/* 极力猫 TM818 随身WiFi 资费与规格展示卡片 (工业灰阶可配置模板, 1080P, 10s @ 30fps) */}
        <Composition
          id="PocketWifiBoard"
          component={PocketWifiBoard}
          durationInFrames={POCKET_WIFI_DURATION}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={defaultPocketWifiProps}
        />
        {/* video-shotcraft 5G CPE Full Promo Film with Word Roll & BGM (22s @ 30fps) */}
        <Composition
          id="CpePromoFull"
          component={CpePromoFull}
          durationInFrames={660}
          fps={30}
          width={1920}
          height={1080}
        />

        {/* video-shotcraft 5G CPE Product Promo Film (18s @ 30fps with BGM & Xiaobai Benchmark HUD) */}
        <Composition
          id="CpeShotcraft"
          component={CpeShotcraftPromo}
          durationInFrames={540}
          fps={30}
          width={1920}
          height={1080}
        />

        {/* 5G CPE Xiaobai Benchmark HUD Standalone (8s @ 30fps) */}
        <Composition
          id="CpeBenchmark"
          component={StandaloneCpeBenchmark}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />

        {/* Xiaobai Review Phone Benchmark Graphic (8s @ 30fps) */}
        <Composition
          id="XiaobaiBenchmark"
          component={XiaobaiBenchmark}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />

        {/* 5G CPE Router Terminal Base Video (18s @ 30fps) */}
        <Composition
          id="CpeTerminal"
          component={CpeTerminalVideo}
          durationInFrames={540}
          fps={30}
          width={1920}
          height={1080}
        />

        {/* Environment Verification & Test Animation (3s @ 30fps) */}
        <Composition
          id="TestAnimation"
          component={TestAnimation}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
