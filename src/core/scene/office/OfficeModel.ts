import { BoxGeometry, Group, Mesh, MeshBasicMaterial } from 'three';
import gsap from 'gsap';
import { OfficeTypeId } from '../../logic/GameParameter';

export class OfficeModel {
  public readonly root: Group = new Group();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(type: OfficeTypeId) {
    const mesh = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial({ color: 0xff0000 }));
    this.root.add(mesh);
    this.root.scale.set(0, 0, 0);
  }

  public setPosition(x: number, y: number, z: number) {
    this.root.position.set(x, y, z);
  }

  public pop() {
    gsap.to(this.root.scale, { x: 1, y: 1, z: 1, duration: 1 });
  }
}
