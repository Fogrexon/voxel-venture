import { Queue } from '../../util/Queue';
import { globalContext } from '../GlobalContext';
import { ProductId } from './GameParameter';

export type Product = {
  readonly productId: ProductId;
  readonly createdAt: number;

  price: number;
};

export type ProduceResult = {
  producedNum: number;
  discardedNum: number;
};

export type SellResult = {
  soldNum: number;
  income: number;
};

export class Office {
  public readonly type: string;

  public readonly builtAt: number;

  public readonly storage: Queue<Product>;

  private _productionProgress: number;

  constructor(type: string, builtAt: number) {
    this.type = type;
    this.builtAt = builtAt;
    this.storage = new Queue();
    this._productionProgress = 0;
  }

  /**
   * 事業所の生産フェーズ
   * @param deltaTime
   */
  public produce(deltaTime: number): ProduceResult {
    const { unitPrice, maxCapacity, productionRate, decayRate } =
      globalContext.officeTree.getOfficeParams(this.type);

    this._productionProgress += deltaTime * productionRate;

    const producedItemNum = Math.floor(this._productionProgress);
    const discardedItemNum = Math.max(this.storage.length + producedItemNum - maxCapacity, 0);
    this._productionProgress -= producedItemNum;

    this.storage.iterate((product) => {
      product.price = Math.max(product.price * (1 - decayRate * deltaTime), 0);
    });

    for (let i = 0; i < producedItemNum - discardedItemNum; i += 1) {
      this.storage.enqueue({
        productId: globalContext.gameParameters.productByType[this.type],
        createdAt: globalContext.gameState.time,
        price: unitPrice,
      });
    }

    return {
      producedNum: producedItemNum,
      discardedNum: discardedItemNum,
    };
  }

  /**
   * 事業所の販売フェーズ
   * @param demandedNum
   */
  public sell(demandedNum: number): SellResult {
    let soldNum = 0;
    let income = 0;

    for (let i = 0; i < demandedNum; i += 1) {
      const product = this.storage.dequeue();
      if (!product) {
        break;
      }
      soldNum += 1;
      // TODO: 需要量に応じた価格設定
      income += product.price;
    }

    globalContext.gameState.money += income;

    return {
      soldNum,
      income,
    };
  }
}
