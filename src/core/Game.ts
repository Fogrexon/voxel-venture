import { OrthographicCamera, Scene, WebGLRenderer } from 'three';
import { Application, Ticker } from 'pixi.js';
import { ImageStore } from './asset/ImageStore';
import { globalContext } from './GlobalContext';
import { ScreenSwitcher } from './ui/ScreenSwitcher';
import { IScreen } from './ui/IScreen';
import { MapScene } from './scene/MapScene';
import { GameParameter } from './logic/GameParameter';
import { OfficeTree } from './logic/OfficeTree';
import { OfficeMap } from './logic/OfficeMap';

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
    globalContext.pixiApp = new Application();
    globalContext.pixiApp
      .init({
        view: gameOptions.uiCanvas,
        width: globalContext.windowInfo.width,
        height: globalContext.windowInfo.height,
        background: 0xffffff,
        backgroundAlpha: 0,
      })
      .then(() => {
        // レンダラの初期化はpromiseを待たないといけない
        globalContext.pixiApp.renderer.events.setTargetElement(gameOptions.townCanvas);
      });
    globalContext.threeRenderer = new WebGLRenderer({
      canvas: gameOptions.townCanvas,
      alpha: true,
    });
    globalContext.threeRenderer.setSize(
      globalContext.windowInfo.width,
      globalContext.windowInfo.height
    );
    globalContext.threeScene = new Scene();
    globalContext.threeCamera = new OrthographicCamera(
      globalContext.windowInfo.width / -2,
      globalContext.windowInfo.width / 2,
      globalContext.windowInfo.height / 2,
      globalContext.windowInfo.height / -2,
      1,
      1000
    );
    globalContext.threeCamera.position.set(5, 5, 5);
    globalContext.threeCamera.lookAt(0, 0, 0);

    // game管理系コンポーネントの初期化
    globalContext.mapScene = new MapScene();
    globalContext.threeScene.add(globalContext.mapScene.root);
    globalContext.imageStore = gameOptions.imageStore;
    globalContext.pipMode = gameOptions.pipMode ?? false;
    globalContext.gameParameters = gameOptions.gameParameters;
    globalContext.officeTree = new OfficeTree(globalContext.gameParameters);
    globalContext.officeMap = new OfficeMap();

    // TODO: テスト用に一個追加しただけなので消す
    globalContext.officeMap.registerOffice(0, 0, 'screw');

    document.title = globalContext.windowInfo.title;

    // global contextが構築に必要な処理
    globalContext.screenSwitcher = new ScreenSwitcher();
    Object.entries(gameOptions.screens).forEach(([name, createScreen]) => {
      const screen = createScreen();
      globalContext.screenSwitcher.registerScreen(name, screen);
      globalContext.pixiApp.stage.addChild(screen.root);
    });
    globalContext.mapScene.buildMap();
  }

  public start() {
    globalContext.pixiApp.ticker.add(this.tick.bind(this));
    globalContext.screenSwitcher.showScreen(this._gameOptions.initialScreen);
  }

  public tick(ticker: Ticker) {
    const deltaTime = ticker.deltaMS / 1000;
    const prevIntTime = Math.floor(globalContext.gameState.time);
    globalContext.gameState.time += deltaTime;
    const currentIntTime = Math.floor(globalContext.gameState.time);
    if (currentIntTime !== prevIntTime) {
      globalContext.officeMap.processAllOffice(1);
    }
  }
}
