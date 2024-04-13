import { UIController } from './ui/UIController';
import { ImageStore } from './asset/ImageStore';
import { OfficeTree } from './logic/OfficeTree';
import { OfficeMap } from './logic/OfficeMap';
import { GameParameter } from './logic/GameParameter';
import { MapController } from './scene/MapController';
import { VVEvent } from '../util/VVEvent';

// データの変更とインターフェースの間の通信はこのイベントを通じて行われる
export type DataChangedEventTable = {
  'get-money': {
    earned: number;
    from: 'office';
    officePosition: { x: number; y: number };
  };
};

export type MapSelectionContext = {
  selectionType: 'place' | 'remove';
  officeType?: string;
};

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
};

export type GlobalContext = {
  mapController: MapController;
  uiController: UIController;
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
    interfaceEvent: VVEvent<InterfaceEventTable>;
    dataChangedEvent: VVEvent<DataChangedEventTable>;
    money: number;
    time: number;
  };
  pipMode: boolean;
};

// globalContextは正しく設定されたうえでゲームが開始されることが保証されているので、nullを握りつぶす
export const globalContext: GlobalContext = {
  mapController: null as unknown as MapController,
  uiController: null as unknown as UIController,
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
    interfaceEvent: new VVEvent<InterfaceEventTable>(),
    dataChangedEvent: new VVEvent<DataChangedEventTable>(),
    money: 100,
    time: 0,
  },
  pipMode: false,
};
