import { Office } from './Office';
import { TwoKeyMap } from '../../util/TwoKeyMap';

type OfficeData = {
  x: number;
  y: number;
  data: Office;
};

export class OfficeMap {
  private _map: TwoKeyMap<number, number, OfficeData> = new TwoKeyMap();

  public registerOffice(x: number, y: number, office: Office): void {
    this._map.set(x, y, { x, y, data: office });
  }
}
