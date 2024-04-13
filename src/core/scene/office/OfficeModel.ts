import { BoxGeometry, Group, Mesh, MeshNormalMaterial } from 'three';
import gsap from 'gsap';
import { OfficeTypeId } from '../../logic/GameParameter';

export class OfficeModel {
  public readonly type: OfficeTypeId;

  public readonly root: Group = new Group();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(type: OfficeTypeId) {
    this.type = type;
    // テスト用にmesh normal materialを使用
    const geometryScale = 0.5;
    const mesh = new Mesh(
      new BoxGeometry(geometryScale, 0.1, geometryScale),
      new MeshNormalMaterial()
    );
    mesh.position.y = 0.05;
    this.root.add(mesh);
    this.root.scale.set(0, 0, 0);
    this.root.position.y = -0.5;
  }

  public setPosition(x: number, z: number) {
    this.root.position.set(x, this.root.position.y, z);
  }

  public popAnimation() {
    gsap.to(this.root.scale, { x: 1, y: 1, z: 1, duration: 0.4 });
    gsap.to(this.root.position, { y: 0, duration: 0.5, ease: 'back.out(1.7)' });
  }

  public hoverAnimation() {
    gsap.to(this.root.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 0.2 });
    gsap.to(this.root.position, { y: 0.1, duration: 0.2 });
  }

  public leaveAnimation() {
    gsap.to(this.root.scale, { x: 1, y: 1, z: 1, duration: 0.2 });
    gsap.to(this.root.position, { y: 0, duration: 0.2 });
  }
}
