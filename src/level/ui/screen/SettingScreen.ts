import { Container, Text } from 'pixi.js';
import gsap from 'gsap';
import { IScreen } from '../../../core/ui/IScreen';
import { GUIWindow } from '../../../core/ui/common/GUIWindow';
import { createFullSizeWindow } from '../common/fullSizeWindow';
import { createCloseButton } from '../common/closeButton';

export class SettingScreen implements IScreen {
  private _root: Container;

  public get root() {
    return this._root;
  }

  private _window: GUIWindow;

  constructor() {
    const content = new Container();

    content.addChild(new Text({ text: 'test' }));
    const closeButton = createCloseButton();
    content.addChild(closeButton.view);
    this._window = createFullSizeWindow(content);
    const { width } = this._window.getContentRect();
    closeButton.view.position.set(width - 25, 25);
    this._root = this._window.view;
    this._root.visible = false;
  }

  public async show() {
    this._root.visible = true;
    this._root.alpha = 0;
    await gsap.to(this._root, { alpha: 1, duration: 0.5 });
  }

  public async hide() {
    await gsap.to(this._root, { alpha: 0, duration: 0.5 });
    this._root.visible = false;
  }
}
