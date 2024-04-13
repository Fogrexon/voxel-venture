import { OrthographicCamera, Vector3 } from 'three';

const mapControlCameraConfig = {
  size: 1,
  zoom: {
    min: 0.1,
    max: 10,
    speed: 2,
  },
  move: {
    speed: 0.5,
  },
} as const;
export class MapControlCamera {
  private _key = {
    up: false,
    down: false,
    left: false,
    right: false,
  };

  private _cameraVector = {
    up: new Vector3(),
    down: new Vector3(),
    left: new Vector3(),
    right: new Vector3(),
  };

  private _zoomDelta = 0;

  public readonly threeCamera: OrthographicCamera;

  public active = true;

  constructor() {
    this.threeCamera = new OrthographicCamera();
    this.threeCamera.zoom = 0.1;
    this.threeCamera.position.set(10, 10, 10);
    this.threeCamera.lookAt(0, 0, 0);

    this.threeCamera.getWorldDirection(this._cameraVector.up);
    this._cameraVector.up.set(this._cameraVector.up.x, 0, this._cameraVector.up.z).normalize();
    this._cameraVector.down.set(-this._cameraVector.up.x, 0, -this._cameraVector.up.z);
    this._cameraVector.left.set(this._cameraVector.up.z, 0, -this._cameraVector.up.x);
    this._cameraVector.right.set(-this._cameraVector.up.z, 0, this._cameraVector.up.x);

    window.addEventListener('wheel', this.handleZoom.bind(this));
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  private handleZoom(event: WheelEvent) {
    const delta = event.deltaY > 0 ? -1 : 1;
    this._zoomDelta = delta * mapControlCameraConfig.zoom.speed;
  }

  private handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'w':
        this._key.up = true;
        break;
      case 's':
        this._key.down = true;
        break;
      case 'a':
        this._key.left = true;
        break;
      case 'd':
        this._key.right = true;
        break;
      default:
        break;
    }
  }

  private handleKeyUp(event: KeyboardEvent) {
    switch (event.key) {
      case 'w':
        this._key.up = false;
        break;
      case 's':
        this._key.down = false;
        break;
      case 'a':
        this._key.left = false;
        break;
      case 'd':
        this._key.right = false;
        break;
      default:
        break;
    }
  }

  public setScreenSize(width: number, height: number) {
    const aspect = width / height;
    this.threeCamera.left = (-mapControlCameraConfig.size * aspect) / 2;
    this.threeCamera.right = (mapControlCameraConfig.size * aspect) / 2;
    this.threeCamera.top = mapControlCameraConfig.size / 2;
    this.threeCamera.bottom = -mapControlCameraConfig.size / 2;
    this.threeCamera.updateProjectionMatrix();
  }

  public updateCameraState(deltaTime: number) {
    if (!this.active) {
      return;
    }

    const speed = mapControlCameraConfig.move.speed / this.threeCamera.zoom;
    if (this._key.up) {
      this.threeCamera.position.add(
        this._cameraVector.up.clone().multiplyScalar(speed * deltaTime)
      );
    }
    if (this._key.down) {
      this.threeCamera.position.add(
        this._cameraVector.down.clone().multiplyScalar(speed * deltaTime)
      );
    }
    if (this._key.left) {
      this.threeCamera.position.add(
        this._cameraVector.left.clone().multiplyScalar(speed * deltaTime)
      );
    }
    if (this._key.right) {
      this.threeCamera.position.add(
        this._cameraVector.right.clone().multiplyScalar(speed * deltaTime)
      );
    }
    this.threeCamera.zoom = Math.min(
      Math.max(
        this.threeCamera.zoom + this._zoomDelta * deltaTime,
        mapControlCameraConfig.zoom.min
      ),
      mapControlCameraConfig.zoom.max
    );
    this._zoomDelta = 0;
    this.threeCamera.updateProjectionMatrix();
  }
}
