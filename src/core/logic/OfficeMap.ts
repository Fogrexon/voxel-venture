import { Office } from './Office';
import { TwoKeyMap } from '../../util/TwoKeyMap';
import { OfficeTypeId } from './GameParameter';
import { globalContext } from '../GlobalContext';

type OfficeData = {
  x: number;
  y: number;
  data: Office;
};

export class OfficeMap {
  public readonly map: TwoKeyMap<number, number, OfficeData> = new TwoKeyMap();

  public registerOffice(x: number, y: number, type: OfficeTypeId): void {
    if (this.map.has(x, y)) {
      throw new Error('Office already exists');
    }
    const { buildCost } = globalContext.officeTree.getOfficeParams(type);

    if (globalContext.gameState.money < buildCost) {
      throw new Error('Not enough money');
    }
    globalContext.gameState.money -= buildCost;

    const office = new Office(type, globalContext.gameState.time);
    this.map.set(x, y, { x, y, data: office });
  }

  public processAllOffice(delta: number) {
    this.map.iterate((_, __, officeData) => {
      officeData.data.produce(delta);
    });
  }

  public sellProduct() {
    let income = 0;
    this.map.iterate((_, __, officeData) => {
      // TODO: 要求量をトレンド等から推定する処理
      const demand = 10;
      const result = officeData.data.sell(demand);
      income += result.income;

      // TODO: 余剰分の処理
    });
    globalContext.gameState.money += income;
  }
}
