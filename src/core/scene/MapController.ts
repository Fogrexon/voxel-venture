import { WebGLRenderer } from 'three';
import { MapSelector } from './MapSelector';
import { MapScene } from './MapScene';
import { MapControlCamera } from './MapControlCamera';
import { globalContext, MapSelectionContext } from '../GlobalContext';

export class MapController {
  private _threeRenderer: WebGLRenderer;

  private _mapControlCamera: MapControlCamera;

  private _mapScene: MapScene;

  private _mapSelector: MapSelector;

  private _context: MapSelectionContext | null = null;

  constructor(renderTargetCanvas: HTMLCanvasElement, eventTargetCanvas: HTMLCanvasElement) {
    this._threeRenderer = new WebGLRenderer({
      canvas: renderTargetCanvas,
      alpha: true,
    });
    this._mapControlCamera = new MapControlCamera();
    this._mapScene = new MapScene();
    this._mapSelector = new MapSelector(
      this._mapControlCamera.threeCamera,
      eventTargetCanvas,
      this._mapScene.threeScene,
      this._mapScene.cursorObject
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

    this._mapSelector.setActive(false, false);

    globalContext.gameState.interfaceEvent.on('map-selection-start', (event) => {
      this._context = event.context;
      this.activateSelector(event.office, event.emptyRot);
    });
    this._mapSelector.on('click', (event) => {
      if (!this._context) {
        throw new Error('context is not defined');
      }
      globalContext.gameState.interfaceEvent.emit('map-selected', {
        x: event.position.x,
        y: event.position.y,
        context: this._context,
      });
      this.deactivateSelector();
    });
  }

  private activateSelector(office: boolean, emptyRot: boolean) {
    this._mapSelector.setActive(office, emptyRot);
    // this._mapControlCamera.active = false;
  }

  private deactivateSelector() {
    this._mapSelector.setActive(false, false);
    // this._mapControlCamera.active = true;
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
