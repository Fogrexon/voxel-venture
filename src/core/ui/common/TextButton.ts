import { ColorSource, Container, Text } from 'pixi.js';
import { Button } from '@pixi/ui';
import { DecoratedRect } from './DecoratedRect';

export type TextButtonOptions = {
  width: number;
  height: number;
  text: string;
  bgStyle?: Partial<{
    round: number;
    fill: ColorSource;
    stroke: ColorSource;
    strokeWidth: number;
  }>;
  textStyle?: Partial<{
    fontFamily: string;
    fontSize: number;
    fill: ColorSource;
  }>;
};

const DEFAULT_TEXT_BUTTON_OPTIONS: TextButtonOptions = {
  width: 100,
  height: 50,
  text: 'Button',
  bgStyle: {
    round: 10,
    fill: 0x000000,
    stroke: 0xffffff,
    strokeWidth: 1,
  },
  textStyle: {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0xffffff,
  },
};

export class TextButton {
  private _button: Button;

  public get button() {
    return this._button;
  }

  public get view() {
    return this._button.view;
  }

  private _bg: DecoratedRect;

  private _text: Text;

  private _options: TextButtonOptions;

  constructor(options: Partial<TextButtonOptions> = {}) {
    this._options = { ...DEFAULT_TEXT_BUTTON_OPTIONS, ...options };
    const bgStyle = { ...DEFAULT_TEXT_BUTTON_OPTIONS.bgStyle, ...(options.bgStyle || {}) };
    const textStyle = { ...DEFAULT_TEXT_BUTTON_OPTIONS.textStyle, ...(options.textStyle || {}) };

    const content = new Container();

    this._bg = new DecoratedRect({
      width: this._options.width,
      height: this._options.height,
      bgStyle: {
        fill: bgStyle.fill,
        stroke: bgStyle.stroke,
        strokeWidth: bgStyle.strokeWidth,
        round: bgStyle.round,
      },
    });
    this._bg.view.position.set(-this._options.width / 2, -this._options.height / 2);
    content.addChild(this._bg.view);

    this._text = new Text({
      text: this._options.text,
      style: {
        fontFamily: textStyle.fontFamily,
        fontSize: textStyle.fontSize,
        fill: textStyle.fill,
      },
    });
    this._text.anchor.set(0.5, 0.5);
    this._text.position.set(0, 0);
    content.addChild(this._text);

    this._button = new Button(content);
  }
}
