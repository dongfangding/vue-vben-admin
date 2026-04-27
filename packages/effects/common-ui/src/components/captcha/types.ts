import type { CSSProperties } from 'vue';

import type { ClassType } from '@vben/types';

export interface CaptchaData {
  /**
   * X coordinate.
   */
  x: number;
  /**
   * Y coordinate.
   */
  y: number;
  /**
   * Click timestamp.
   */
  t: number;
}

export interface CaptchaPoint extends CaptchaData {
  /**
   * Point index.
   */
  i: number;
}

export interface PointSelectionCaptchaCardProps {
  /**
   * Captcha image source.
   */
  captchaImage: string;
  /**
   * Captcha image height.
   * @default '220px'
   */
  height?: number | string;
  /**
   * Horizontal padding.
   * @default '12px'
   */
  paddingX?: number | string;
  /**
   * Vertical padding.
   * @default '16px'
   */
  paddingY?: number | string;
  /**
   * Captcha title.
   * @default '?????'
   */
  title?: string;
  /**
   * Captcha image width.
   * @default '300px'
   */
  width?: number | string;
}

export interface PointSelectionCaptchaProps extends PointSelectionCaptchaCardProps {
  /**
   * Auto trigger confirm after the given click count.
   */
  autoConfirmCount?: number;
  /**
   * Whether to show the confirm button.
   * @default false
   */
  showConfirm?: boolean;
  /**
   * Hint image.
   * @default ''
   */
  hintImage?: string;
  /**
   * Hint text.
   * @default ''
   */
  hintText?: string;
}

export interface SliderCaptchaProps {
  class?: ClassType;
  /**
   * @description Slider action style.
   * @default {}
   */
  actionStyle?: CSSProperties;

  /**
   * @description Slider bar style.
   * @default {}
   */
  barStyle?: CSSProperties;

  /**
   * @description Content style.
   * @default {}
   */
  contentStyle?: CSSProperties;

  /**
   * @description Wrapper style.
   * @default {}
   */
  wrapperStyle?: CSSProperties;

  /**
   * @description Whether used as a slot for linked components.
   * @default false
   */
  isSlot?: boolean;

  /**
   * @description Success message.
   * @default '????'
   */
  successText?: string;

  /**
   * @description Prompt text.
   * @default '???????'
   */
  text?: string;
}

export interface SliderRotateCaptchaProps {
  /**
   * @description Allowed rotation difference.
   * @default 20
   */
  diffDegree?: number;

  /**
   * @description Image size.
   * @default 260
   */
  imageSize?: number;

  /**
   * @description Image wrapper style.
   * @default {}
   */
  imageWrapperStyle?: CSSProperties;

  /**
   * @description Maximum rotation angle.
   * @default 270
   */
  maxDegree?: number;

  /**
   * @description Minimum rotation angle.
   * @default 90
   */
  minDegree?: number;

  /**
   * @description Image source.
   */
  src?: string;
  /**
   * @description Default prompt text.
   */
  defaultTip?: string;
}

export interface SliderTranslateCaptchaProps {
  /**
   * @description Puzzle width.
   * @default 420
   */
  canvasWidth?: number;
  /**
   * @description Puzzle height.
   * @default 280
   */
  canvasHeight?: number;
  /**
   * @description Square block side length.
   * @default 42
   */
  squareLength?: number;
  /**
   * @description Circle radius.
   * @default 10
   */
  circleRadius?: number;
  /**
   * @description Image source.
   */
  src?: string;
  /**
   * @description Allowed position difference.
   * @default 3
   */
  diffDistance?: number;
  /**
   * @description Default prompt text.
   */
  defaultTip?: string;
}

export interface CaptchaVerifyPassingData {
  isPassing: boolean;
  time: number | string;
}

export interface SliderCaptchaActionType {
  resume: () => void;
}

export interface SliderRotateVerifyPassingData {
  event: MouseEvent | TouchEvent;
  moveDistance: number;
  moveX: number;
}
