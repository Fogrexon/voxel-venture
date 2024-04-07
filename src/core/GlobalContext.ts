import { Application } from 'pixi.js';
import { WebGLRenderer } from 'three';
import { ScreenSwitcher } from './ui/ScreenSwitcher';

export type GlobalContext = {
  pixiApp: Application;
  threeRenderer: WebGLRenderer;
  screenSwitcher: ScreenSwitcher;
  windowInfo: {
    width: number;
    height: number;
    title: string;
  };
};

// globalContextは正しく設定されたうえでゲームが開始されることが保証されているので、nullを握りつぶす
export const globalContext: GlobalContext = {
  pixiApp: null as unknown as Application,
  threeRenderer: null as unknown as WebGLRenderer,
  screenSwitcher: null as unknown as ScreenSwitcher,
  windowInfo: {
    width: 800,
    height: 600,
    title: 'VoxelVenture',
  },
};
