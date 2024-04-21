import { GameParameter } from '../core/logic/GameParameter';

export const gameParameters: GameParameter = {
  groupOrder: {
    parts: 0,
  },
  productByType: {
    screw: 'screw',
  },
  demandOptionTable: {
    screw: {
      baseDemand: 10,
      economicSensitivity: 1,
    },
  },
  blueprintTable: {
    'screw-open': {
      officeType: 'screw',
      group: 'parts',
      level: 0,
      name: 'Screw Open',
      description: 'Screw Open',
      cost: 0,
      officeParams: {
        type: 'screw',
        buildCost: 1,
        runningCost: 0.03,
        unitPrice: 1,
        maxCapacity: 10,
        productionRate: 1,
        decayRate: 0.1,
      },
      isFirstUnlocked: true,
      linkTo: ['screw-update'],
    },
    'screw-update': {
      officeType: 'screw',
      group: 'parts',
      level: 1,
      name: 'Screw Update',
      description: 'Screw Update',
      cost: 10,
      officeParams: {
        type: 'screw',
        unitPrice: 1.5,
        maxCapacity: 20,
      },
      isFirstUnlocked: false,
      linkTo: [],
    },
  },
};
