import { OfficeTypeId } from './GameParameter';
import { DataChangedEventTable, globalContext } from '../GlobalContext';

export type HandleBudgetEvent = {
  'office-build': {
    cost: number;
    type: OfficeTypeId;
    position: { x: number; y: number };
  };
  'office-accounts': {
    profit: number;
    cost: number;
    type: OfficeTypeId;
    position: { x: number; y: number };
  };
  'office-upgrade': {
    cost: number;
    type: OfficeTypeId;
  };
  'loan-increment': {
    amount: number;
  };
  'loan-repayment': {
    amount: number;
  };
  'loan-interest': {
    amount: number;
  };
};

export type BusinessBudget = {
  fund: number;
  loan: number;
};

export type AccountingRecord = {
  timeStamp: [number, number];
  officeProfit: number;
  officeCost: number;
  buildCost: number;
  upgradeCost: number;
  loanInterest: number;
};

const budgetHandler: {
  [K in keyof HandleBudgetEvent]: (
    budget: BusinessBudget,
    currentAccountingRecord: AccountingRecord,
    info: HandleBudgetEvent[K]
  ) => boolean;
} = {
  'office-build': (
    budget: BusinessBudget,
    currentAccountingRecord: AccountingRecord,
    info: HandleBudgetEvent['office-build']
  ) => {
    if (budget.fund < info.cost) return false;
    budget.fund -= info.cost;
    currentAccountingRecord.buildCost += info.cost;
    return true;
  },
  'office-accounts': (
    budget: BusinessBudget,
    currentAccountingRecord: AccountingRecord,
    info: HandleBudgetEvent['office-accounts']
  ) => {
    budget.fund += info.profit - info.cost;
    currentAccountingRecord.officeProfit += info.profit;
    currentAccountingRecord.officeCost += info.cost;
    return true;
  },
  'office-upgrade': (
    budget: BusinessBudget,
    currentAccountingRecord: AccountingRecord,
    info: HandleBudgetEvent['office-upgrade']
  ) => {
    if (budget.fund < info.cost) return false;
    budget.fund -= info.cost;
    currentAccountingRecord.upgradeCost += info.cost;
    return true;
  },
  'loan-increment': (
    budget: BusinessBudget,
    currentAccountingRecord: AccountingRecord,
    info: HandleBudgetEvent['loan-increment']
  ) => {
    budget.loan += info.amount;
    currentAccountingRecord.loanInterest += info.amount;
    return true;
  },
  'loan-repayment': (
    budget: BusinessBudget,
    _: AccountingRecord,
    info: HandleBudgetEvent['loan-repayment']
  ) => {
    if (budget.fund < info.amount) return false;
    budget.fund -= info.amount;
    budget.loan -= info.amount;
    return true;
  },
  'loan-interest': (
    budget: BusinessBudget,
    currentAccountingRecord: AccountingRecord,
    info: HandleBudgetEvent['loan-interest']
  ) => {
    budget.fund -= info.amount;
    currentAccountingRecord.loanInterest += info.amount;
    return true;
  },
};

const LOAN_INTEREST_RATE = 0.1;

export class BudgetManager {
  private readonly _budget: BusinessBudget;

  public get budget(): Readonly<BusinessBudget> {
    return this._budget;
  }

  private _currentAccountingRecord: AccountingRecord;

  public get currentAccountingRecord(): Readonly<AccountingRecord> {
    return this._currentAccountingRecord;
  }

  private _accountingRecords: AccountingRecord[];

  public get accountingRecords(): Readonly<Readonly<AccountingRecord>[]> {
    return this._accountingRecords;
  }

  constructor(initialFund: number, initialLoan: number) {
    this._budget = { fund: initialFund, loan: initialLoan };
    this._currentAccountingRecord = {
      timeStamp: [1990, 1],
      officeProfit: 0,
      officeCost: 0,
      buildCost: 0,
      upgradeCost: 0,
      loanInterest: 0,
    };
    this._accountingRecords = [];
  }

  public changeBudget<T extends keyof HandleBudgetEvent>(
    type: T,
    info: HandleBudgetEvent[T]
  ): boolean {
    const flag = budgetHandler[type](this._budget, this._currentAccountingRecord, info);

    if (flag) {
      globalContext.gameState.dataChangedEvent.emit(type, info as DataChangedEventTable[T]);
    }

    return flag;
  }

  public nextMonth(year: number, month: number) {
    this.changeBudget('loan-interest', { amount: this._budget.loan * LOAN_INTEREST_RATE });

    this._accountingRecords.push({ ...this._currentAccountingRecord });

    this._currentAccountingRecord = {
      timeStamp: [year, month],
      officeProfit: 0,
      officeCost: 0,
      buildCost: 0,
      upgradeCost: 0,
      loanInterest: 0,
    };
  }

  public canUseFund(amount: number): boolean {
    return this._budget.fund >= amount;
  }
}
