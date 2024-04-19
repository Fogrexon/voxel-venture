import { ColorSource, Container, Graphics, NineSliceSprite, Sprite, Texture } from 'pixi.js';

export type DecoratedRectOptions = {
  width: number;
  height: number;
  bgStyle?: {
    fill?: ColorSource;
    stroke?: ColorSource;
    fillAlpha?: number;
    strokeAlpha?: number;
    strokeWidth?: number;
    round?: number;
  };
  bgImage?: Texture;
  bgSlice?: {
    top: number;
    left: number;
    right: number;
    bottom: number;
  };
};

export class DecoratedRect {
  public readonly view: Container = new Container();

  private _rectType: 'image-rect' | 'slice-rect' | 'graphic-rect';

  private bg: Sprite | NineSliceSprite | Graphics;

  private _options: DecoratedRectOptions;

  constructor(options: DecoratedRectOptions) {
    this._options = options;
    const { width, height, bgStyle, bgImage, bgSlice } = options;

    if (bgImage && !bgSlice) {
      this._rectType = 'image-rect';
      const bgSprite = new Sprite(bgImage);
      bgSprite.width = width;
      bgSprite.height = height;
      this.bg = bgSprite;
      this.view.addChild(bgSprite);
    } else if (bgImage && bgSlice) {
      this._rectType = 'slice-rect';
      const bgSprite = new NineSliceSprite({
        texture: bgImage,
        leftWidth: bgSlice.left,
        rightWidth: bgSlice.right,
        topHeight: bgSlice.top,
        bottomHeight: bgSlice.bottom,
      });
      bgSprite.width = width;
      bgSprite.height = height;
      this.bg = bgSprite;
      this.view.addChild(bgSprite);
    } else if (bgStyle) {
      this._rectType = 'graphic-rect';
      this.bg = new Graphics();
      this.redrawRect(width, height, bgStyle);
      this.view.addChild(this.bg);
    } else {
      throw new Error('Invalid options: bgImage or bgStyle is required.');
    }
  }

  private redrawRect(
    width: number,
    height: number,
    bgStyle: DecoratedRectOptions['bgStyle'] = this._options.bgStyle
  ) {
    if (this._rectType !== 'graphic-rect' || !(this.bg instanceof Graphics) || !bgStyle) return;

    let context = this.bg.clear();

    if (bgStyle.round) {
      context = context.roundRect(0, 0, width, height, bgStyle.round);
    } else {
      context = context.rect(0, 0, width, height);
    }
    if (bgStyle.fill !== undefined) {
      context = context.fill({
        color: bgStyle.fill,
        alpha: bgStyle.fillAlpha ?? 1,
      });
    }
    if (bgStyle.stroke !== undefined) {
      context = context.stroke({
        color: bgStyle.stroke,
        alpha: bgStyle.strokeAlpha ?? 1,
        width: bgStyle.strokeWidth ?? 2,
      });
    }
    this.bg = context;
  }

  public get position() {
    return this.view.position;
  }

  public set position(value: { x: number; y: number }) {
    this.view.position.set(value.x, value.y);
  }

  public get width() {
    return this.bg.width;
  }

  public set width(value: number) {
    if (this._rectType === 'image-rect' || this._rectType === 'slice-rect') {
      this.bg.width = value;
    } else {
      this.redrawRect(value, this.height);
    }
  }

  public get height() {
    return this.bg.height;
  }

  public set height(value: number) {
    if (this._rectType === 'image-rect' || this._rectType === 'slice-rect') {
      this.bg.height = value;
    } else {
      this.redrawRect(this.width, value);
    }
  }

  public get visible() {
    return this.view.visible;
  }

  public set visible(value: boolean) {
    this.view.visible = value;
  }
}
