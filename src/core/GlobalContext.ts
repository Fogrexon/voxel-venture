import { Texture as PixiTexture } from 'pixi.js';
import { Group, Texture as ThreeTexture } from 'three';
import { UIController } from './ui/UIController';
import { OfficeTree } from './logic/OfficeTree';
import { OfficeMap } from './logic/OfficeMap';
import { GameParameter } from './logic/GameParameter';
import { MapController } from './scene/MapController';
import { VVEvent } from '../util/VVEvent';
import { AssetLoader } from './asset/AssetLoader';
import { BudgetManager, HandleBudgetEvent } from './logic/BudgetManager';
import { Calender } from './logic/Calender';

// データの変更とインターフェースの間の通信はこのイベントを通じて行われる
export type DataChangedEventTable = HandleBudgetEvent & {
  'build-office': {
    type: string;
    position: { x: number; y: number };
  };
  'open-office-tree': {
    blueprintId: string;
  };
  'next-day': {
    year: number;
    month: number;
    day: number;
  };
  'next-month': {
    year: number;
    month: number;
  };
  'next-year': {
    year: number;
  };
};

export type MapSelectionContext = {
  selectionType: 'place' | 'remove';
  officeType?: string;
};

export type PixiTextureLoader = AssetLoader<PixiTexture>;
export type ThreeTextureLoader = AssetLoader<ThreeTexture>;
export type ThreeModelLoader = AssetLoader<Group>;

// 3D空間のマップとUIの間の通信はこのイベントを通じて行われる
export type InterfaceEventTable = {
  'map-selection-start': {
    office: boolean;
    emptyRot: boolean;
    context: MapSelectionContext;
  };
  'map-selected': {
    x: number;
    y: number;
    context: MapSelectionContext;
  };
  'map-selection-end': {};
  'map-selection-pause': {};
  'map-selection-resume': {};
};

export type GlobalContext = {
  mapController: MapController;
  uiController: UIController;
  pixiTextureLoader: PixiTextureLoader;
  threeTextureLoader: ThreeTextureLoader;
  threeModelLoader: ThreeModelLoader;
  officeTree: OfficeTree;
  officeMap: OfficeMap;
  calender: Calender;
  budget: BudgetManager;
  gameParameters: GameParameter;
  windowInfo: {
    width: number;
    height: number;
    title: string;
  };
  gameEvents: {
    interfaceEvent: VVEvent<InterfaceEventTable>;
    dataChangedEvent: VVEvent<DataChangedEventTable>;
  };
  pipMode: boolean;
};

// globalContextは正しく設定されたうえでゲームが開始されることが保証されているので、nullを握りつぶす
export const globalContext: GlobalContext = {
  mapController: null as unknown as MapController,
  uiController: null as unknown as UIController,
  pixiTextureLoader: null as unknown as PixiTextureLoader,
  threeTextureLoader: null as unknown as ThreeTextureLoader,
  threeModelLoader: null as unknown as ThreeModelLoader,
  officeTree: null as unknown as OfficeTree,
  officeMap: null as unknown as OfficeMap,
  calender: null as unknown as Calender,
  budget: new BudgetManager(100, 100),
  gameParameters: null as unknown as GameParameter,
  windowInfo: {
    width: 800,
    height: 600,
    title: 'VoxelVenture',
  },
  gameEvents: {
    interfaceEvent: new VVEvent<InterfaceEventTable>(),
    dataChangedEvent: new VVEvent<DataChangedEventTable>(),
  },
  pipMode: false,
};
