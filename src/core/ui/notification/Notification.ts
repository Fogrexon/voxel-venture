import { Container, Sprite, Text } from 'pixi.js';
import gsap from 'gsap';
import { DecoratedRect } from '../common/DecoratedRect';
import { globalContext } from '../../GlobalContext';
import { wait } from '../../../util/wait';

export const NOTIFICATION_CONFIGS = {
  width: 400,
  height: 70,
  get bottom() {
    return this.height / 2 + 10;
  },
  round: 0,
  iconWidth: 50,
  textSize: 16,
};

export class Notification {
  public readonly view: Container = new Container();

  private _bg: DecoratedRect | null = null;

  private _icon: Sprite | null = null;

  private _text: Text | null = null;

  public init() {
    // anchor (0.0, 0.5)
    this.view.position.set(
      globalContext.windowInfo.width,
      globalContext.windowInfo.height - NOTIFICATION_CONFIGS.bottom
    );

    this._bg = new DecoratedRect({
      width: NOTIFICATION_CONFIGS.width,
      height: NOTIFICATION_CONFIGS.height,
      bgStyle: {
        fill: 0x330000,
        fillAlpha: 1.0,
        round: NOTIFICATION_CONFIGS.round,
      },
    });
    this._bg.view.position.set(0, -NOTIFICATION_CONFIGS.height / 2);
    this.view.addChild(this._bg.view);

    this._icon = Sprite.from(globalContext.pixiTextureLoader.get('ui/info-icon.png'));
    this._icon.width = NOTIFICATION_CONFIGS.iconWidth;
    this._icon.height = NOTIFICATION_CONFIGS.iconWidth;
    this._icon.anchor.set(0.5, 0.5);
    this._icon.position.set(NOTIFICATION_CONFIGS.iconWidth / 2, 0);
    this.view.addChild(this._icon);

    this._text = new Text({
      text: '',
      style: {
        fill: 0xffffff,
        fontSize: NOTIFICATION_CONFIGS.textSize,
        wordWrap: true,
        wordWrapWidth: NOTIFICATION_CONFIGS.width - NOTIFICATION_CONFIGS.iconWidth,
      },
    });
    this._text.anchor.set(0.5, 0.5);
    this._text.position.set(
      NOTIFICATION_CONFIGS.iconWidth +
        (NOTIFICATION_CONFIGS.width - NOTIFICATION_CONFIGS.iconWidth) / 2,
      0
    );
    this.view.addChild(this._text);
  }

  public async show(text: string) {
    if (!this._text) {
      throw new Error('Notification text is not initialized');
    }
    this._text.text = text;
    this.view.visible = true;
    await gsap.to(this.view, {
      x: globalContext.windowInfo.width - NOTIFICATION_CONFIGS.width,
      duration: 0.5,
    });
    await wait(2000);
    await gsap.to(this.view, { x: globalContext.windowInfo.width, duration: 0.5 });
    this.view.visible = false;
  }
}
