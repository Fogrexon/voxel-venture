import { Graphics } from 'pixi.js';
import { UIComponent } from './UIComponent';

export class Button extends UIComponent {
  private _image: HTMLImageElement;

  private _onClick: () => void;

  constructor(image: HTMLImageElement, onClick: () => void) {
    super();
    this._image = image;
    this._onClick = onClick;
  }

  protected createUIGraphics(): Graphics {
    // image button
    const graphics = new Graphics();
    // graphics.beginTextureFill({ texture: this._image });
    // graphics.rect(0, 0, this._image.width, this._image.height);
    // graphics.fill();
    // graphics.interactive = true;
    // graphics.buttonMode = true;
    // graphics.on('pointertap', this._onClick);

    return graphics;
  }
}
