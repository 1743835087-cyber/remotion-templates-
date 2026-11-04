import React from 'react';
import {
  TypeEntranceMoves,
  TYPE_ENTRANCE_MOVES_DURATION,
} from './TypeEntranceMoves';
import type { TypeEntranceMovesProps } from './TypeEntranceMoves';
import {
  TypeEntranceGuofeng,
  GUOFENG_DURATION,
} from './TypeEntranceGuofeng';
import type { TypeEntranceGuofengProps } from './TypeEntranceGuofeng';

export {
  TypeEntranceMoves,
  TYPE_ENTRANCE_MOVES_DURATION,
  TypeEntranceGuofeng,
  GUOFENG_DURATION,
};
export type { TypeEntranceMovesProps, TypeEntranceGuofengProps };

// 预设 1: 旗舰深色科技黑客风 (GRAVITY · 极光青)
export const TypeEntranceGravityDark: React.FC<TypeEntranceMovesProps> = (
  props
) => (
  <TypeEntranceMoves
    text="GRAVITY"
    subtitle="打破重力界限 · 让每一个落点皆是节拍"
    category="TYPE-ENTRANCE-MOVES // 01"
    tagline="DAMPED OSCILLATION & KINETIC SYNCHRONIZATION"
    tone="dark"
    accentColor="#00F5FF"
    fontSize={176}
    floorY={590}
    {...props}
  />
);

// 预设 2: 现代瑞士纸张极简风 (GRAVITY · 瑞士红)
export const TypeEntranceGravityLight: React.FC<TypeEntranceMovesProps> = (
  props
) => (
  <TypeEntranceMoves
    text="GRAVITY"
    subtitle="Every character lands on the beat."
    category="SWISS EDITORIAL // KINETIC MOVE"
    tagline="PHYSICAL LETTER DROP // 2026"
    tone="light"
    accentColor="#FF4422"
    fontSize={176}
    floorY={590}
    {...props}
  />
);

// 预设 3: 国风汉字觉醒版 - 玄墨暗金 (重力觉醒 · 赤金与朱砂印)
export const TypeEntranceGuofengDark: React.FC<TypeEntranceGuofengProps> = (
  props
) => (
  <TypeEntranceGuofeng
    text="重力觉醒"
    subtitle="字落千钧势破竹 · 瞬息回正定乾坤"
    chapter="卷壹 · 汉字形意动力学 · 金石篇"
    tagline="势若九鼎 · 落地生根"
    sealText="形意"
    tone="dark"
    accentGold="#E5C07B"
    accentRed="#C23531"
    fontSize={200}
    floorY={580}
    {...props}
  />
);

// 兼容别名
export const TypeEntranceChinese = TypeEntranceGuofengDark;

// 预设 4: 国风汉字觉醒版 - 素宣朱砂 (重力觉醒 · 素宣沉墨)
export const TypeEntranceGuofengLight: React.FC<TypeEntranceGuofengProps> = (
  props
) => (
  <TypeEntranceGuofeng
    text="重力觉醒"
    subtitle="字落千钧势破竹 · 瞬息回正定乾坤"
    chapter="卷壹 · 汉字形意动力学 · 金石篇"
    tagline="势若九鼎 · 落地生根"
    sealText="觉醒"
    tone="light"
    accentGold="#D4AF37"
    accentRed="#C23531"
    fontSize={200}
    floorY={580}
    {...props}
  />
);

// 预设 5: 科技破局者风 (DISRUPT · 荧光绿)
export const TypeEntranceDisrupt: React.FC<TypeEntranceMovesProps> = (
  props
) => (
  <TypeEntranceMoves
    text="DISRUPT"
    subtitle="颠覆常规认知 · 重构全场景连接"
    category="KINETIC TYPE // BREAKTHROUGH"
    tagline="HARDWARE ACCELERATED KINETICS"
    tone="dark"
    accentColor="#00E599"
    fontSize={176}
    floorY={590}
    {...props}
  />
);
