import { Queue } from '../../util/Queue';
import { globalContext } from '../GlobalContext';
import { OfficeTypeId, ProductId } from './GameParameter';
import { Timestamp } from './Calender';

export type Product = {
  readonly productId: ProductId;
  readonly createdAt: Timestamp;

  price: number;
};

export class Office {
  public readonly type: OfficeTypeId;

  public readonly builtAt: Timestamp;

  public readonly position: { x: number; y: number };

  public readonly storage: Queue<Product>;

  private _productionProgress: number;

  constructor(type: string, position: { x: number; y: number }, builtAt: Timestamp) {
    this.type = type;
    this.builtAt = builtAt;
    this.position = position;
    this.storage = new Queue();
    this._productionProgress = 0;
  }

  /**
   * 事業所の生産フェーズ
   * @param deltaDay
   */
  public produce(deltaDay: number) {
    const { unitPrice, maxCapacity, productionRate, decayRate } =
      globalContext.officeTree.getOfficeParams(this.type);

    this._productionProgress += deltaDay * productionRate;

    const producedItemNum = Math.floor(this._productionProgress);
    const discardedItemNum = Math.max(this.storage.length + producedItemNum - maxCapacity, 0);
    this._productionProgress -= producedItemNum;

    this.storage.iterate((product) => {
      product.price = Math.max(product.price * (1 - decayRate * deltaDay), 0);
    });

    for (let i = 0; i < producedItemNum - discardedItemNum; i += 1) {
      this.storage.enqueue({
        productId: globalContext.gameParameters.productByType[this.type],
        createdAt: globalContext.calender.getCurrentTimestamp(),
        price: unitPrice,
      });
    }
  }

  /**
   * 事業所の販売フェーズ
   * @param demandedNum
   */
  public sell(demandedNum: number) {
    let soldNum = 0;
    let profit = 0;

    for (let i = 0; i < demandedNum; i += 1) {
      const product = this.storage.dequeue();
      if (!product) {
        break;
      }
      soldNum += 1;
      // TODO: 需要量に応じた価格設定
      profit += product.price;
    }

    const { runningCost } = globalContext.officeTree.getOfficeParams(this.type);
    globalContext.budget.changeBudget('office-accounts', {
      profit,
      cost: runningCost,
      type: this.type,
      position: this.position,
    });

    return soldNum;
  }
}
