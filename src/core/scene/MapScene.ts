import { Group } from 'three';
import { globalContext } from '../GlobalContext';
import { OfficeModel } from './office/OfficeModel';

export class MapScene {
  public readonly root: Group = new Group();

  public buildMap() {
    const officeMap = globalContext.officeMap.map;

    officeMap.iterate((x, y, officeData) => {
      const office = officeData.data;
      const mesh = new OfficeModel(office.type);
      this.root.add(mesh.root);
      mesh.setPosition(x, y, 0);
      mesh.pop();
    });
  }
}
