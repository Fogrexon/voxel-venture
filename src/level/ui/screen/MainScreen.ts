import { Container } from 'pixi.js';
import gsap from 'gsap';
import { IScreen } from '../../../core/ui/IScreen';
import { createSettingButton } from './main/buttons';

export class MainScreen implements IScreen {
  private _root: Container = new Container();

  public get root() {
    return this._root;
  }

  private _buttons = new Container();

  private _settingButton = createSettingButton();

  constructor() {
    this._root.addChild(this._buttons);
    this._buttons.addChild(this._settingButton.view);
  }

  public async show() {
    this._root.visible = true;
    this._root.alpha = 0;
    await gsap.to(this._root, { alpha: 1, duration: 1 });
  }

  public async hide() {
    await gsap.to(this._root, { alpha: 0, duration: 1 });
    this._root.visible = false;
  }
}
