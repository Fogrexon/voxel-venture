import { IScreen } from './IScreen';

/**
 * スクリーンの切り替えをつかさどるクラス
 */
export class ScreenSwitcher {
  private screens: Record<string, IScreen>;

  private currentScreen: string | null = null;

  constructor() {
    this.screens = {};
  }

  public registerScreen(name: string, screen: IScreen) {
    this.screens[name] = screen;
  }

  public async showScreen(name: string) {
    if (this.currentScreen) {
      await this.screens[this.currentScreen].hide();
    }
    this.currentScreen = name;
    await this.screens[name].show();
  }

  public async hideScreen() {
    if (this.currentScreen) {
      await this.screens[this.currentScreen].hide();
      this.currentScreen = null;
    }
  }
}
