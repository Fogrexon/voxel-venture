import { Container, Rectangle, Texture } from 'pixi.js';
import { DecoratedRect } from './DecoratedRect';

export type GUIWindowOptions = {
  width: number;
  height: number;
  padding: number;
  bgImage?: Texture;
  bgSlice?: {
    top: number;
    left: number;
    right: number;
    bottom: number;
  };
};

export class GUIWindow {
  protected _view: Container = new Container();

  public get view() {
    return this._view;
  }

  protected _content: Container;

  public get content() {
    return this._content;
  }

  protected _bg: DecoratedRect;

  protected _options: GUIWindowOptions;

  constructor(content: Container, options: GUIWindowOptions) {
    this._options = options;
    this._content = content;
    this._bg = new DecoratedRect({
      width: this._options.width,
      height: this._options.height,
      bgImage: this._options.bgImage,
      bgSlice: this._options.bgSlice,
      bgStyle: {
        fill: 0xaaaaaa,
        stroke: 0x888888,
        fillAlpha: 1,
        strokeAlpha: 1,
        strokeWidth: 2,
        round: 10,
      },
    });

    this._view.addChild(this._bg.view);
    this._content.position.set(this._options.padding, this._options.padding);
    this._view.addChild(this._content);
  }

  public getContentRect() {
    return new Rectangle(
      this._options.padding,
      this._options.padding,
      this._options.width - this._options.padding * 2,
      this._options.height - this._options.padding * 2
    );
  }
}
