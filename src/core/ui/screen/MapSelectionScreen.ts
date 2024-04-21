import { Container } from 'pixi.js';
import gsap from 'gsap';
import { IScreen } from '../IScreen';
import { createCloseButton } from './common/closeButton';
import { globalContext, InterfaceEventTable } from '../../GlobalContext';

export class MapSelectionScreen implements IScreen {
  private _root: Container = new Container();

  public get root() {
    return this._root;
  }

  private _buttonWrapper = new Container();

  private _handleMapSelectCache = this.handleMapSelect.bind(this);

  public constructor() {
    const closeButton = createCloseButton();
    const { width } = globalContext.windowInfo;
    closeButton.view.position.set(width - 25, 25);
    this._buttonWrapper.addChild(closeButton.view);
    this._buttonWrapper.position.y = -50;
    this._root.addChild(this._buttonWrapper);
    this._root.visible = false;
  }

  public async handleMapSelect(event: InterfaceEventTable['map-selected']) {
    const { officeType } = event.context;
    if (!officeType) {
      throw new Error('officeType is not defined');
    }
    const officeParams = globalContext.officeTree.getOfficeParams(officeType);
    if (!officeParams) {
      throw new Error('officeParams is not defined');
    }
    if (globalContext.gameState.money < officeParams.buildCost) {
      await globalContext.uiController.openAlert('お金が足りません');
      return;
    }
    globalContext.officeMap.registerOffice(event.x, event.y, officeType);
    globalContext.uiController.sendNotification('オフィスを建設しました');
    globalContext.uiController.showScreen('main');
  }

  public async show(): Promise<void> {
    this._root.visible = true;
    globalContext.gameState.interfaceEvent.on('map-selected', this._handleMapSelectCache);
    await gsap.to(this._buttonWrapper.position, { y: 0, duration: 0.3 });
  }

  public async hide(): Promise<void> {
    globalContext.gameState.interfaceEvent.off('map-selected', this._handleMapSelectCache);
    globalContext.gameState.interfaceEvent.emit('map-selection-end', {});
    await gsap.to(this._buttonWrapper.position, { y: -50, duration: 0.3 });
    this._root.visible = false;
  }
}
