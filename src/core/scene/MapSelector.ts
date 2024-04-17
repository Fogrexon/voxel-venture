import { Camera, Object3D, Raycaster, Vector2 } from 'three';
import { EventEmitter } from 'pixi.js';
import { wait } from '../../util/wait';
import { globalContext } from '../GlobalContext';

export type MapSelectorEvent = {
  hover: {
    position: {
      x: number;
      y: number;
    };
  };
  leave: {
    position: {
      x: number;
      y: number;
    };
  };
  click: {
    position: {
      x: number;
      y: number;
    };
  };
};

export class MapSelector extends EventEmitter<MapSelectorEvent> {
  private readonly _camera: Camera;

  private readonly _canvas: HTMLCanvasElement;

  private readonly _selectionPlane: Object3D;

  private readonly _cursorObject: Object3D;

  private readonly _raycaster: Raycaster = new Raycaster();

  private readonly _selected = new Vector2();

  private readonly _mousePos = new Vector2();

  private readonly _tempVec = new Vector2();

  private _officeSelectActive = false;

  private _emptyRotActive = false;

  // アクティブ直後はleaveイベントを発火しないようにするためのフラグ
  private _skipLeave = false;

  private _handleMouseMoveCache = this.handleMouseMove.bind(this);

  private _handleMouseClickCache = this.handleMouseClick.bind(this);

  constructor(
    camera: Camera,
    canvas: HTMLCanvasElement,
    selectionPlane: Object3D,
    cursorObject: Object3D
  ) {
    super();
    this._camera = camera;
    this._canvas = canvas;
    this._selectionPlane = selectionPlane;
    this._cursorObject = cursorObject;
    this._raycaster = new Raycaster();
  }

  public handleMouseMove(event: MouseEvent) {
    const rect = this._canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this._mousePos.set(x, y);

    this._raycaster.setFromCamera(this._mousePos, this._camera);

    const intersects = this._raycaster.intersectObject(this._selectionPlane);

    if (intersects.length > 0) {
      const { point } = intersects[0];
      // マスは1x1の正方形なので、x, z座標を整数に丸める
      this._tempVec.set(Math.floor(point.x + 0.5), Math.floor(point.z + 0.5));

      if (!this._selected.equals(this._tempVec)) {
        if (!this._skipLeave) {
          this.emit('leave', {
            position: {
              x: this._selected.x,
              y: this._selected.y,
            },
          });
        } else {
          this._skipLeave = false;
        }
        this._selected.copy(this._tempVec);
        this.emit('hover', {
          position: {
            x: this._selected.x,
            y: this._selected.y,
          },
        });
        this._cursorObject.position.set(this._selected.x, 0, this._selected.y);
      }
    }
  }

  public handleMouseClick(event: MouseEvent) {
    if (event.button === 0) {
      const office = globalContext.officeMap.map.get(this._selected.x, this._selected.y);
      if ((this._officeSelectActive && office) || (this._emptyRotActive && !office)) {
        this.emit('click', {
          position: {
            x: this._selected.x,
            y: this._selected.y,
          },
        });
      }
    }
  }

  public async setActive(office: boolean, emptyRot: boolean) {
    const prevActive = this._officeSelectActive || this._emptyRotActive;
    const nextActive = office || emptyRot;
    if (prevActive && nextActive) return;
    if (nextActive) {
      // モード開始時のクリックイベントを発火させないように、少し待ってからイベントリスナーを登録する
      await wait(100);
      this._canvas.addEventListener('mousemove', this._handleMouseMoveCache);
      this._canvas.addEventListener('click', this._handleMouseClickCache);
      this._cursorObject.visible = true;
    } else {
      this.emit('leave', {
        position: {
          x: this._selected.x,
          y: this._selected.y,
        },
      });
      this._skipLeave = true;

      if (this._handleMouseMoveCache && this._handleMouseClickCache) {
        this._canvas.removeEventListener('mousemove', this._handleMouseMoveCache);
        this._canvas.removeEventListener('click', this._handleMouseClickCache);
      }
      this._cursorObject.visible = false;
    }
    this._officeSelectActive = office;
    this._emptyRotActive = emptyRot;
  }
}
