import { Graphics } from 'pixi.js';
import { UIComponent } from './UIComponent';

export type GUIWindowSettings = {
  title: string;
  width: number;
  height: number;
  round: number;
  edgeImage?: HTMLImageElement;
};

export class GUIWindow extends UIComponent {
  private _settings: GUIWindowSettings;

  constructor(settings: GUIWindowSettings) {
    super();
    this._settings = settings;
  }

  protected createUIGraphics(): Graphics {
    const graphics = new Graphics();
    // graphics.fill();
    // graphics.roundRect(0, 0, 200, 200, 5);
    // graphics.beginFill(0x000000, 0.5);
    // graphics.drawRect(0, 0, 200, 200);
    // graphics.endFill();
    //
    // const titleText = new Text(this._title, { fill: 0xffffff });
    // titleText.position.set(5, 5);
    // graphics.addChild(titleText);
    //
    // this._content.position.set(5, 20);
    // graphics.addChild(this._content);

    return graphics;
  }
}
