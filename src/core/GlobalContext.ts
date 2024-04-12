import { Application } from 'pixi.js';
import { ScreenSwitcher } from './ui/ScreenSwitcher';
import { ImageStore } from './asset/ImageStore';
import { OfficeTree } from './logic/OfficeTree';
import { OfficeMap } from './logic/OfficeMap';
import { GameParameter } from './logic/GameParameter';
import { MapController } from './scene/MapController';

export type GlobalContext = {
  pixiApp: Application;
  mapController: MapController;
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
  mapController: null as unknown as MapController,
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
