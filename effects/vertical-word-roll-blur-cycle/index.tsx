import React from 'react';
import {
  VerticalWordRollBlurCycle,
  VERTICAL_WORD_ROLL_BLUR_CYCLE_DURATION,
} from './VerticalWordRollBlurCycle';
import type { VerticalWordRollBlurCycleProps } from './VerticalWordRollBlurCycle';

export {
  VerticalWordRollBlurCycle,
  VERTICAL_WORD_ROLL_BLUR_CYCLE_DURATION,
};
export type { VerticalWordRollBlurCycleProps };

// Preset 1: Default Video-Shotcraft Brand Style (Light, Purple Accent)
export const VerticalWordRollDefault: React.FC<VerticalWordRollBlurCycleProps> = (
  props
) => <VerticalWordRollBlurCycle {...props} />;

// Preset 2: 5G CPE Hardware / Tech Style (Dark, Cyan / Electric Blue Accent, Chinese text)
export const VerticalWordRollCpeTech: React.FC<VerticalWordRollBlurCycleProps> = (
  props
) => (
  <VerticalWordRollBlurCycle
    prefix="全场景无线宽带，专为"
    words={['租房青年', '差旅办公', '户外直播', '全屋千兆']}
    accentColor="#00F5FF"
    accentDimColor="#4A5568"
    inkColor="#FFFFFF"
    bgColor="#080C14"
    tone="dark"
    maskWidth={170}
    {...props}
  />
);
