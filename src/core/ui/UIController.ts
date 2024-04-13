import { Application, TickerCallback } from 'pixi.js';
import { IScreen } from './IScreen';
import { globalContext } from '../GlobalContext';

/**
 * スクリーンの切り替えをつかさどるクラス
 */
export class UIController {
  private _pixiApp: Application;

  private _uiCanvas: HTMLCanvasElement;

  private _screens: Record<string, IScreen>;

  private _currentScreen: string | null = null;

  constructor(uiCanvas: HTMLCanvasElement) {
    this._pixiApp = new Application();
    this._uiCanvas = uiCanvas;
    this._screens = {};
  }

  public async init(tick: TickerCallback<any>) {
    await this._pixiApp.init({
      view: this._uiCanvas,
      width: globalContext.windowInfo.width,
      height: globalContext.windowInfo.height,
      backgroundAlpha: 0,
      autoStart: true,
    });
    this._pixiApp.ticker.add(tick);
  }

  public registerScreen(name: string, screen: IScreen) {
    this._screens[name] = screen;
    this._pixiApp.stage.addChild(screen.root);
  }

  public async showScreen(name: string) {
    if (this._currentScreen) {
      await this._screens[this._currentScreen].hide();
    }
    this._currentScreen = name;
    await this._screens[name].show();
  }

  public async hideScreen() {
    if (this._currentScreen) {
      await this._screens[this._currentScreen].hide();
      this._currentScreen = null;
    }
  }
}
