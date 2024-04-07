import { WebGLRenderer } from 'three';
import { Application } from 'pixi.js';
import { ImageStore } from './asset/ImageStore';
import { globalContext } from './GlobalContext';
import { ScreenSwitcher } from './ui/ScreenSwitcher';
import { Screen } from './ui/Screen';

export type GameSettings = {
  uiCanvas: HTMLCanvasElement;
  townCanvas: HTMLCanvasElement;
  imageStore: ImageStore;
  screens: Record<string, Screen>;
};

export class Game {
  constructor(gameSettings: GameSettings) {
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
    globalContext.pixiApp = new Application({
      view: gameSettings.uiCanvas,
      width: globalContext.windowInfo.width,
      height: globalContext.windowInfo.height,
    });
    globalContext.threeRenderer = new WebGLRenderer({
      canvas: gameSettings.townCanvas,
    });
    globalContext.threeRenderer.setSize(
      globalContext.windowInfo.width,
      globalContext.windowInfo.height
    );

    // set up screens
    globalContext.screenSwitcher = new ScreenSwitcher(gameSettings.screens);

    document.title = globalContext.windowInfo.title;
  }

  public async start() {
    await globalContext.screenSwitcher.showScreen('title');
  }
}
