import { Application } from 'pixi.js';
import { Camera, Scene, WebGLRenderer } from 'three';
import { ScreenSwitcher } from './ui/ScreenSwitcher';
import { ImageStore } from './asset/ImageStore';
import { OfficeTree } from './logic/OfficeTree';
import { OfficeMap } from './logic/OfficeMap';
import { GameParameter } from './logic/GameParameter';
import { MapScene } from './scene/MapScene';

export type GlobalContext = {
  pixiApp: Application;
  threeRenderer: WebGLRenderer;
  threeScene: Scene;
  threeCamera: Camera;
  mapScene: MapScene;
  screenSwitcher: ScreenSwitcher;
  imageStore: ImageStore;
  officeTree: OfficeTree;
  officeMap: OfficeMap;
  gameParameters: GameParameter;
  windowInfo: {
    width: number;
    height: number;
    title: string;
  };
  gameState: {
    money: number;
    time: number;
  };
  pipMode: boolean;
};

// globalContextは正しく設定されたうえでゲームが開始されることが保証されているので、nullを握りつぶす
export const globalContext: GlobalContext = {
  pixiApp: null as unknown as Application,
  threeRenderer: null as unknown as WebGLRenderer,
  threeScene: null as unknown as Scene,
  threeCamera: null as unknown as Camera,
  mapScene: null as unknown as MapScene,
  screenSwitcher: null as unknown as ScreenSwitcher,
  imageStore: null as unknown as ImageStore,
  officeTree: null as unknown as OfficeTree,
  officeMap: null as unknown as OfficeMap,
  gameParameters: null as unknown as GameParameter,
  windowInfo: {
    width: 800,
    height: 600,
    title: 'VoxelVenture',
  },
  gameState: {
    money: 100,
    time: 0,
  },
  pipMode: false,
};
