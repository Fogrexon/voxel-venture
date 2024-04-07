import { WebGLRenderer } from 'three';
import { Application } from 'pixi.js';
import { ImageStore } from './asset/ImageStore';
import { globalContext } from './GlobalContext';
import { ScreenSwitcher } from './ui/ScreenSwitcher';
import { IScreen } from './ui/IScreen';

export type GameSettings = {
  uiCanvas: HTMLCanvasElement;
  townCanvas: HTMLCanvasElement;
  imageStore: ImageStore;
  screens: Record<string, () => IScreen>;
  initialScreen: string;
  pipMode?: boolean;
};

export class Game {
  private _gameSettings: GameSettings;

  constructor(gameSettings: GameSettings) {
    this._gameSettings = gameSettings;

    // set up canvas
    gameSettings.uiCanvas.width = globalContext.windowInfo.width;
    gameSettings.uiCanvas.height = globalContext.windowInfo.height;
    gameSettings.uiCanvas.style.position = 'absolute';
    gameSettings.uiCanvas.style.top = '0';
    gameSettings.uiCanvas.style.left = '0';
    gameSettings.townCanvas.width = globalContext.windowInfo.width;
    gameSettings.townCanvas.height = globalContext.windowInfo.height;
    gameSettings.townCanvas.style.position = 'absolute';
    gameSettings.townCanvas.style.top = '0';
    gameSettings.townCanvas.style.left = '0';

    // setup pixi and three
    globalContext.pixiApp = new Application();
    globalContext.pixiApp
      .init({
        view: gameSettings.uiCanvas,
        width: globalContext.windowInfo.width,
        height: globalContext.windowInfo.height,
        background: 0xffffff,
        backgroundAlpha: 0,
      })
      .then(() => {
        // レンダラの初期化はpromiseを待たないといけない
        globalContext.pixiApp.renderer.events.setTargetElement(gameSettings.townCanvas);
      });
    globalContext.threeRenderer = new WebGLRenderer({
      canvas: gameSettings.townCanvas,
      alpha: true,
    });
    globalContext.threeRenderer.setSize(
      globalContext.windowInfo.width,
      globalContext.windowInfo.height
    );
    globalContext.imageStore = gameSettings.imageStore;
    globalContext.pipMode = gameSettings.pipMode ?? false;

    document.title = globalContext.windowInfo.title;

    // set up screens
    // global contextがスクリーンの構築に必要なので、最後
    globalContext.screenSwitcher = new ScreenSwitcher();
    Object.entries(gameSettings.screens).forEach(([name, createScreen]) => {
      const screen = createScreen();
      globalContext.screenSwitcher.registerScreen(name, screen);
      globalContext.pixiApp.stage.addChild(screen.root);
    });
  }

  public async start() {
    await globalContext.screenSwitcher.showScreen(this._gameSettings.initialScreen);
  }
}
