import { Group, Mesh, MeshBasicMaterial, PlaneGeometry, Texture } from 'three';
import { globalContext } from '../GlobalContext';
import { OfficeModel } from './office/OfficeModel';
import { wait } from '../../util/wait';

export class MapScene {
  public readonly root: Group = new Group();

  public buildMap() {
    const officeMap = globalContext.officeMap.map;

    officeMap.iterate(async (x, y) => {
      // TODO: 店のタイプに応じてモデルを変える仕組みを考える
      const model = new OfficeModel();
      this.root.add(model.root);
      model.setPosition(x, y);
      await wait((Math.abs(x) + Math.abs(y)) * 100);
      model.pop();
    });

    const roadTexture = new Texture();
    roadTexture.image = globalContext.imageStore.get('scene/road.png');
    roadTexture.repeat.set(100, 100);
    roadTexture.wrapS = roadTexture.wrapT = 1000;
    roadTexture.offset.set(0.5, 0.5);
    roadTexture.needsUpdate = true;
    const roadMesh = new Mesh(
      new PlaneGeometry(100, 100),
      new MeshBasicMaterial({ map: roadTexture })
    );
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.scale.set(1, 1, 1);
    roadMesh.position.y = 0;

    this.root.add(roadMesh);
  }
}
