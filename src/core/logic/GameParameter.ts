/**
 * JSON形式でゲームのパラメーターを設定する用の型定義
 */

// データ上の区別は無いが、IDを明確に分けるために導入
export type GroupId = string;
export type OfficeTypeId = string;
export type ProductId = string;
export type OfficeBlueprintId = string;

/**
 * 事業所運営に必要なパラメーター
 */
export type OfficeParams = {
  type: string;
  buildCost: number;
  unitPrice: number;
  maxCapacity: number;
  productionRate: number;
  decayRate: number;
};

/**
 * 事業所の解放ツリー用のデータ
 */
export type OfficeBlueprint = {
  readonly officeType: OfficeTypeId;
  readonly group: GroupId;
  readonly level: number;
  readonly name: string;
  readonly description: string;
  readonly cost: number;
  readonly officeParams: Partial<OfficeParams>;
  readonly isFirstUnlocked: boolean;
  readonly linkTo: OfficeBlueprintId[];
};

/**
 * 需要を計算する用のオプション
 */
export type DemandOption = {
  readonly baseDemand: number;
  readonly economicSensitivity: number;
};

export type GameParameter = {
  readonly groupOrder: Record<GroupId, number>;
  readonly productByType: Record<OfficeTypeId, ProductId>;
  readonly demandOptionTable: Record<ProductId, DemandOption>;
  readonly blueprintTable: Record<OfficeBlueprintId, OfficeBlueprint>;
};
