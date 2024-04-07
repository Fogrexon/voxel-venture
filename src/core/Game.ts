import { WebGLRenderer } from 'three';
import { Application } from 'pixi.js';
import { ImageStore } from './asset/ImageStore';
import { globalContext } from './GlobalContext';
import { ScreenSwitcher } from './ui/ScreenSwitcher';
import { IScreen } from './ui/IScreen';

export type GameOptions = {
  uiCanvas: HTMLCanvasElement;
  townCanvas: HTMLCanvasElement;
  imageStore: ImageStore;
  screens: Record<string, () => IScreen>;
  initialScreen: string;
  pipMode?: boolean;
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
    globalContext.imageStore = gameOptions.imageStore;
    globalContext.pipMode = gameOptions.pipMode ?? false;

    document.title = globalContext.windowInfo.title;

    // set up screens
    // global contextがスクリーンの構築に必要なので、最後
    globalContext.screenSwitcher = new ScreenSwitcher();
    Object.entries(gameOptions.screens).forEach(([name, createScreen]) => {
      const screen = createScreen();
      globalContext.screenSwitcher.registerScreen(name, screen);
      globalContext.pixiApp.stage.addChild(screen.root);
    });
  }

  public async start() {
    await globalContext.screenSwitcher.showScreen(this._gameOptions.initialScreen);
  }
}
