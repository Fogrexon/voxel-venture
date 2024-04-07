import { Screen } from './Screen';

/**
 * スクリーンの切り替えをつかさどるクラス
 */
export class ScreenSwitcher {
  private screens: Record<string, Screen>;

  private currentScreen: string | null = null;

  constructor(screens: Record<string, Screen>) {
    this.screens = screens;
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
