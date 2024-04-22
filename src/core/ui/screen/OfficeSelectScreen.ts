import { Container, Text } from 'pixi.js';
import gsap from 'gsap';
import { IScreen } from '../IScreen';
import { GUIWindow } from '../common/GUIWindow';
import { createFullSizeWindow } from './common/fullSizeWindow';
import { createCloseButton } from './common/closeButton';
import { createOfficeButton } from './officePlace/button';
import { globalContext } from '../../GlobalContext';

export class OfficeSelectScreen implements IScreen {
  private _root: Container;

  public get root() {
    return this._root;
  }

  private _window: GUIWindow;

  private _officeButtonContainer = new Container();

  constructor() {
    const content = new Container();

    content.addChild(new Text({ text: 'test' }));
    const closeButton = createCloseButton();
    content.addChild(closeButton.view);

    content.addChild(this._officeButtonContainer);

    this._window = createFullSizeWindow(content);
    const { width } = this._window.getContentRect();
    closeButton.view.position.set(width - 25, 25);
    this._root = this._window.view;
    this._root.visible = false;
  }

  public async show() {
    this._officeButtonContainer.removeChildren();
    Object.keys(globalContext.officeTree.officeParamsTable).forEach((officeType, index) => {
      const button = createOfficeButton(officeType, () => {
        globalContext.uiController.showScreen('mapSelection');
        globalContext.gameEvents.interfaceEvent.emit('map-selection-start', {
          office: false,
          emptyRot: true,
          context: {
            selectionType: 'place',
            officeType,
          },
        });
      });
      button.position.set(0, 100 + index * 50);
      this._officeButtonContainer.addChild(button);
    });

    this._root.visible = true;
    this._root.alpha = 0;
    await gsap.to(this._root, { alpha: 1, duration: 0.3 });
  }

  public async hide() {
    await gsap.to(this._root, { alpha: 0, duration: 0.3 });
    this._root.visible = false;
  }
}
