import { BoxGeometry, Group, Mesh, MeshBasicMaterial, PlaneGeometry, Scene, Texture } from 'three';
import { globalContext } from '../GlobalContext';
import { OfficeModel } from './office/OfficeModel';
import { TwoKeyMap } from '../../util/TwoKeyMap';

export class MapScene {
  private readonly _root: Group = new Group();

  private readonly _officeModels: TwoKeyMap<number, number, OfficeModel> = new TwoKeyMap();

  public readonly cursorObject = new Group();

  public readonly threeScene: Scene = new Scene();

  constructor() {
    this.threeScene.add(this._root);
  }

  public buildMap() {
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

    this._root.add(roadMesh);

    const cursorObject = new Mesh(
      new BoxGeometry(1, 1, 1),
      new MeshBasicMaterial({ color: 0x000000, opacity: 0.5, transparent: true })
    );
    cursorObject.scale.set(1, 0.01, 1);
    cursorObject.position.y = 0.01;
    this.cursorObject.add(cursorObject);
    this.cursorObject.visible = false;
    this._root.add(this.cursorObject);
  }

  public rebuildMap() {
    const officeMap = globalContext.officeMap.map;

    officeMap.iterate(async (x, y, officeData) => {
      const model = this._officeModels.get(x, y);
      if (model?.type === officeData.type) {
        return;
      }
      if (model) {
        this._root.remove(model.root);
        this._officeModels.delete(x, y);
      }

      // TODO: 店のタイプに応じてモデルを変える仕組みを考える
      const newModel = new OfficeModel(officeData.type);
      this._root.add(newModel.root);
      this._officeModels.set(x, y, newModel);
      newModel.setPosition(x, y);
      newModel.popAnimation();
    });
  }

  public onHover(x: number, y: number) {
    const model = this._officeModels.get(x, y);
    if (model) {
      model.hoverAnimation();
    } else {
      // 空き地のハイライト処理
    }
  }

  public onLeave(x: number, y: number) {
    const model = this._officeModels.get(x, y);
    if (model) {
      model.leaveAnimation();
    } else {
      // 空き地のハイライト解除処理
    }
  }

  public onClick(x: number, y: number) {
    const model = this._officeModels.get(x, y);
    if (model) {
      // do something
    }
  }
}
