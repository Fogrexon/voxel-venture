import { WebGLRenderer } from 'three';
import { MapSelector } from './MapSelector';
import { MapScene } from './MapScene';
import { MapControlCamera } from './MapControlCamera';

export class MapController {
  private _threeRenderer: WebGLRenderer;

  private _mapControlCamera: MapControlCamera;

  private _mapScene: MapScene;

  private _mapSelector: MapSelector;

  constructor(canvas: HTMLCanvasElement) {
    this._threeRenderer = new WebGLRenderer({
      canvas,
      alpha: true,
    });
    this._mapControlCamera = new MapControlCamera();
    this._mapScene = new MapScene();
    this._mapSelector = new MapSelector(
      this._mapControlCamera.threeCamera,
      this._threeRenderer.domElement,
      this._mapScene.threeScene
    );

    this._mapSelector.on('hover', (event) => {
      this._mapScene.onHover(event.position.x, event.position.y);
    });
    this._mapSelector.on('leave', (event) => {
      this._mapScene.onLeave(event.position.x, event.position.y);
    });
    this._mapSelector.on('click', (event) => {
      this._mapScene.onClick(event.position.x, event.position.y);
    });
  }

  public setSize(width: number, height: number) {
    this._threeRenderer.setSize(width, height);
    this._mapControlCamera.setScreenSize(width, height);
  }

  public start() {
    this._mapScene.buildMap();
  }

  public tick(deltaTime: number) {
    this._mapControlCamera.updateCameraState(deltaTime);
  }

  public render() {
    this._threeRenderer.render(this._mapScene.threeScene, this._mapControlCamera.threeCamera);
  }

  public rebuildMap() {
    this._mapScene.rebuildMap();
  }
}
