import { Application, Container, TickerCallback } from 'pixi.js';
import { IScreen } from './IScreen';
import { globalContext } from '../GlobalContext';
import { Alert } from './modal/Alert';
import { Confirm } from './modal/Confirm';

/**
 * スクリーンの切り替えをつかさどるクラス
 */
export class UIController {
  private _pixiApp: Application;

  private _uiCanvas: HTMLCanvasElement;

  private _screens: Record<string, IScreen>;

  private _currentScreen: string | null = null;

  private _screenContainer: Container;

  private _alert: Alert;

  private _confirm: Confirm;

  constructor(uiCanvas: HTMLCanvasElement) {
    this._pixiApp = new Application();
    this._uiCanvas = uiCanvas;
    this._screens = {};
    this._screenContainer = new Container();
    this._alert = new Alert();
    this._confirm = new Confirm();
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

    this._pixiApp.stage.addChild(this._screenContainer);

    this._pixiApp.stage.addChild(this._alert.root);
    this._alert.root.zIndex = 100;

    this._pixiApp.stage.addChild(this._confirm.root);
    this._confirm.root.zIndex = 100;
  }

  public registerScreen(name: string, screen: IScreen) {
    this._screens[name] = screen;
    this._screenContainer.addChild(screen.root);
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

  public async openAlert(text: string) {
    this._alert.setText(text);
    this._screenContainer.interactiveChildren = false;
    await this._alert.show();
    this._screenContainer.interactiveChildren = true;
  }

  public async openConfirm(text: string) {
    this._confirm.setText(text);
    this._screenContainer.interactiveChildren = false;
    const result = await this._confirm.show();
    this._screenContainer.interactiveChildren = true;
    return result;
  }
}
