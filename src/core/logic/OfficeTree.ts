import { globalContext } from '../GlobalContext';
import { OfficeBlueprint, GameParameter, OfficeParams } from './GameParameter';

export class OfficeTree {
  public readonly blueprintTable: Record<string, OfficeBlueprint>;

  public readonly officeParamsTable: Record<string, OfficeParams> = {};

  public unlockedBlueprints: string[] = [];

  public unlockReadyBlueprints: string[] = [];

  constructor(gameParameter: GameParameter) {
    this.blueprintTable = gameParameter.blueprintTable;
    this.setupInitialBlueprints();
  }

  private setupInitialBlueprints() {
    Object.entries(this.blueprintTable).forEach(([blueprintId, blueprint]) => {
      if (!blueprint.isFirstUnlocked) return;

      // 解放待ちリストに入れておかないとエラーが出る
      this.unlockReadyBlueprints.push(blueprintId);
      this.unlockBlueprint(blueprintId);
    });
  }

  public unlockBlueprint(id: string) {
    const blueprint = this.blueprintTable[id];
    // エラーチェック
    if (!blueprint) {
      throw new Error(`Unknown blueprint: ${id}`);
    }
    if (this.unlockedBlueprints.includes(id)) {
      throw new Error(`Already unlocked: ${id}`);
    }
    if (!this.unlockReadyBlueprints.includes(id)) {
      throw new Error(`Dependency not unlocked: ${id}`);
    }
    if (!globalContext.budget.canUseFund(blueprint.cost)) {
      throw new Error(`Not enough money: ${id}`);
    }

    // アンロック処理
    globalContext.budget.changeBudget('office-upgrade', {
      cost: -blueprint.cost,
      type: blueprint.officeType,
    });
    this.unlockedBlueprints.push(id);
    this.unlockReadyBlueprints = this.unlockReadyBlueprints.filter((b) => b !== id);
    this.unlockReadyBlueprints.push(...blueprint.linkTo);

    // パラメータの適用
    if (blueprint.officeParams) {
      if (!this.officeParamsTable[blueprint.officeType]) {
        this.officeParamsTable[blueprint.officeType] = {
          type: blueprint.officeType,
          buildCost: 0,
          runningCost: 0,
          unitPrice: 0,
          maxCapacity: 0,
          productionRate: 0,
          decayRate: 0,
        };
      }
      this.officeParamsTable[blueprint.officeType] = {
        ...this.officeParamsTable[blueprint.officeType],
        ...blueprint.officeParams,
      };
    }
  }

  /**
   * 事業所のパラメーターを取得する
   * 解放された設計図に基づきパラメーターが更新される
   * @param type
   */
  public getOfficeParams(type: string): OfficeParams {
    const officeParams = this.officeParamsTable[type];
    if (!officeParams) {
      throw new Error(`Unknown office type: ${type}`);
    }
    return officeParams;
  }
}
