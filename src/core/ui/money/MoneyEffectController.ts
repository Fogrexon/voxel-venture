import { Container } from 'pixi.js';
import { ObjectPool } from '../../../util/ObjectPool';
import { MoneyEffect } from './MoneyEffect';
import { globalContext } from '../../GlobalContext';

export class MoneyEffectController {
  public readonly root: Container = new Container();

  private _effects: ObjectPool<MoneyEffect>;

  constructor() {
    this._effects = new ObjectPool({
      create: () => {
        const obj = new MoneyEffect();
        this.root.addChild(obj.view);
        return obj;
      },
      checkActive: (effect) => effect.active,
      reset: (effect) => effect.reset(),
    });
  }

  public async showMoneyEffect(money: number, position: { x: number; y: number }) {
    const effect = this._effects.getInstance();
    const screenPos = globalContext.mapController.getScreenPosition(position);
    effect.active = true;
    await effect.animate(money, screenPos);
    effect.active = false;
  }

  public init() {
    globalContext.gameState.dataChangedEvent.on('office-build', (event) => {
      this.showMoneyEffect(-event.cost, event.position);
    });

    globalContext.gameState.dataChangedEvent.on('office-accounts', (event) => {
      this.showMoneyEffect(event.profit - event.cost, event.position);
    });

    globalContext.gameState.dataChangedEvent.on('office-upgrade', (event) => {
      this.showMoneyEffect(event.cost, {
        x: globalContext.windowInfo.width / 2,
        y: globalContext.windowInfo.height / 2,
      });
    });
    globalContext.gameState.dataChangedEvent.on('loan-increment', (event) => {
      this.showMoneyEffect(event.amount, {
        x: globalContext.windowInfo.width / 2,
        y: globalContext.windowInfo.height / 2,
      });
    });
    globalContext.gameState.dataChangedEvent.on('loan-repayment', (event) => {
      this.showMoneyEffect(-event.amount, {
        x: globalContext.windowInfo.width / 2,
        y: globalContext.windowInfo.height / 2,
      });
    });
  }
}
