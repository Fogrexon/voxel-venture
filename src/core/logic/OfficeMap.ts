import { Office } from './Office';
import { TwoKeyMap } from '../../util/TwoKeyMap';
import { OfficeTypeId } from './GameParameter';
import { globalContext } from '../GlobalContext';

export class OfficeMap {
  public readonly map: TwoKeyMap<number, number, Office> = new TwoKeyMap();

  public registerOffice(x: number, y: number, type: OfficeTypeId): void {
    if (this.map.has(x, y)) {
      throw new Error('Office already exists');
    }
    const { buildCost } = globalContext.officeTree.getOfficeParams(type);

    if (!globalContext.budget.canUseFund(buildCost)) {
      throw new Error('Not enough money');
    }

    const office = new Office(type, { x, y }, globalContext.calender.getCurrentTimestamp());
    this.map.set(x, y, office);
    globalContext.gameEvents.dataChangedEvent.emit('build-office', { position: { x, y }, type });
    globalContext.budget.changeBudget('office-build', {
      cost: buildCost,
      type,
      position: { x, y },
    });
  }

  public processAllOffice(delta: number) {
    this.map.iterate((_, __, officeData) => {
      officeData.produce(delta);
    });
  }

  public sellProduct() {
    this.map.iterate((_, __, officeData) => {
      // TODO: 要求量をトレンド等から推定する処理
      const demand = 10;
      officeData.sell(demand);
      // TODO: 余剰分の処理
    });
  }
}
