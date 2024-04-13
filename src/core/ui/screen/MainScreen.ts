import { Container } from 'pixi.js';
import gsap from 'gsap';
import { IScreen } from '../IScreen';
import { createOfficeSelectionButton, createSettingButton } from './main/buttons';

export class MainScreen implements IScreen {
  private _root: Container = new Container();

  public get root() {
    return this._root;
  }

  private _buttons = new Container();

  private _settingButton = createSettingButton();

  private _officeSelectButton = createOfficeSelectionButton();

  constructor() {
    this._root.addChild(this._buttons);
    this._buttons.addChild(this._settingButton.view);
    this._buttons.addChild(this._officeSelectButton.view);
  }

  public async show() {
    this._root.visible = true;
    this._root.alpha = 0;
    await gsap.to(this._root, { alpha: 1, duration: 0.3 });
  }

  public async hide() {
    await gsap.to(this._root, { alpha: 0, duration: 0.3 });
    this._root.visible = false;
  }
}
