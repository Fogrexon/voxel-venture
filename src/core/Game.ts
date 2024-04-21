import { Ticker } from 'pixi.js';
import { ImageStore } from './asset/ImageStore';
import { globalContext } from './GlobalContext';
import { UIController } from './ui/UIController';
import { IScreen } from './ui/IScreen';
import { GameParameter } from './logic/GameParameter';
import { OfficeTree } from './logic/OfficeTree';
import { OfficeMap } from './logic/OfficeMap';
import { MapController } from './scene/MapController';

export type GameOptions = {
  uiCanvas: HTMLCanvasElement;
  townCanvas: HTMLCanvasElement;
  imageStore: ImageStore;
  screens: Record<string, () => IScreen>;
  initialScreen: string;
  pipMode?: boolean;
  gameParameters: GameParameter;
};

export class Game {
  private _gameOptions: GameOptions;

  constructor(gameOptions: GameOptions) {
    this._gameOptions = gameOptions;

    // set up canvas
    gameOptions.uiCanvas.width = globalContext.windowInfo.width;
    gameOptions.uiCanvas.height = globalContext.windowInfo.height;
    gameOptions.uiCanvas.style.position = 'absolute';
    gameOptions.uiCanvas.style.top = '0';
    gameOptions.uiCanvas.style.left = '0';
    gameOptions.townCanvas.width = globalContext.windowInfo.width;
    gameOptions.townCanvas.height = globalContext.windowInfo.height;
    gameOptions.townCanvas.style.position = 'absolute';
    gameOptions.townCanvas.style.top = '0';
    gameOptions.townCanvas.style.left = '0';

    // setup pixi and three
    globalContext.uiController = new UIController(gameOptions.uiCanvas);
    globalContext.mapController = new MapController(gameOptions.townCanvas, gameOptions.uiCanvas);

    // game管理系コンポーネントの初期化
    globalContext.imageStore = gameOptions.imageStore;
    globalContext.pipMode = gameOptions.pipMode ?? false;
    globalContext.gameParameters = gameOptions.gameParameters;

    globalContext.officeTree = new OfficeTree(globalContext.gameParameters);
    globalContext.officeMap = new OfficeMap();

    document.title = globalContext.windowInfo.title;

    // global contextが構築に必要な処理
    globalContext.uiController = new UIController(gameOptions.uiCanvas);
    Object.entries(gameOptions.screens).forEach(([name, createScreen]) => {
      const screen = createScreen();
      globalContext.uiController.registerScreen(name, screen);
    });
  }

  public start() {
    globalContext.uiController.init(this.tick.bind(this));
    globalContext.mapController.setSize(
      globalContext.windowInfo.width,
      globalContext.windowInfo.height
    );
    globalContext.mapController.start();
    globalContext.uiController.showScreen(this._gameOptions.initialScreen);
  }

  public tick(ticker: Ticker) {
    const deltaTime = ticker.deltaMS / 1000;
    const prevIntTime = Math.floor(globalContext.gameState.time);
    globalContext.gameState.time += deltaTime;
    const currentIntTime = Math.floor(globalContext.gameState.time);
    if (currentIntTime !== prevIntTime) {
      globalContext.officeMap.processAllOffice(1);
    }
    globalContext.mapController.tick(deltaTime);
    globalContext.mapController.render();
  }
}
