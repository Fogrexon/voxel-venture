import { Camera, Object3D, Raycaster, Vector2 } from 'three';
import { EventEmitter } from 'pixi.js';

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

  private readonly _raycaster: Raycaster = new Raycaster();

  private readonly _selected = new Vector2();

  private readonly _mousePos = new Vector2();

  private readonly _tempVec = new Vector2();

  private _active = false;

  // アクティブ直後はleaveイベントを発火しないようにするためのフラグ
  private _skipLeave = false;

  constructor(camera: Camera, canvas: HTMLCanvasElement, selectionPlane: Object3D) {
    super();
    this._camera = camera;
    this._canvas = canvas;
    this._selectionPlane = selectionPlane;
    this._raycaster = new Raycaster();
  }

  private handleMouseMove(event: MouseEvent) {
    const rect = this._canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this._mousePos.set(x, y);

    this._raycaster.setFromCamera(this._mousePos, this._camera);

    const intersects = this._raycaster.intersectObject(this._selectionPlane);

    if (intersects.length > 0) {
      const { point } = intersects[0];
      // マスは1x1の正方形なので、x, z座標を整数に丸める
      this._tempVec.set(Math.floor(point.x), Math.floor(point.z));

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
      }
    }
  }

  private handleMouseClick(event: MouseEvent) {
    if (event.button === 0) {
      this.emit('click', {
        position: {
          x: this._selected.x,
          y: this._selected.y,
        },
      });
    }
  }

  public setActive(active: boolean) {
    if (this._active === active) return;
    if (active) {
      this._canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
      this._canvas.addEventListener('click', this.handleMouseClick.bind(this));
    } else {
      this.emit('leave', {
        position: {
          x: this._selected.x,
          y: this._selected.y,
        },
      });
      this._skipLeave = true;

      this._canvas.removeEventListener('mousemove', this.handleMouseMove.bind(this));
      this._canvas.removeEventListener('click', this.handleMouseClick.bind(this));
    }
  }
}
