import { Container, Graphics, Text } from 'pixi.js';
import gsap from 'gsap';
import { globalContext } from '../../GlobalContext';
import { DecoratedRect } from '../common/DecoratedRect';
import { wiggle } from '../../../util/animation';

export const MODAL_CONFIGS = {
  width: 400,
  height: 300,
  round: 10,
  headerSize: 20,
  backgroundColor: 0xffffff,
  backgroundAlpha: 1.0,
  blockerColor: 0x000000,
  blockerAlpha: 0.5,
  strokeColor: 0xffffff,
  strokeWeight: 2,
  titleStyle: {
    fill: 0x000000,
    fontSize: 20,
  },
  get contentWidth() {
    return this.width;
  },
  get contentHeight() {
    return this.height - this.headerSize;
  },
};

export abstract class Modal {
  public readonly root: Container = new Container();

  protected readonly modalBlocker: Graphics = new Graphics();

  protected readonly modal: Container = new Container();

  protected readonly content: Container = new Container();

  protected readonly titleText: Text = new Text();

  private _title: string;

  public constructor(title: string) {
    this._title = title;
  }

  public init() {
    // setup modal blocker
    this.modalBlocker
      .rect(0, 0, globalContext.windowInfo.width, globalContext.windowInfo.height)
      .fill({
        color: MODAL_CONFIGS.blockerColor,
        alpha: MODAL_CONFIGS.blockerAlpha,
      });
    this.modalBlocker.position.set(0, 0);
    this.modalBlocker.interactive = true;
    this.root.addChild(this.modalBlocker);

    // setup modal
    this.modal.position.set(
      globalContext.windowInfo.width / 2,
      globalContext.windowInfo.height / 2
    );
    this.root.addChild(this.modal);

    // setup background of modal
    const background = new DecoratedRect({
      width: MODAL_CONFIGS.width,
      height: MODAL_CONFIGS.height,
      bgStyle: {
        fill: MODAL_CONFIGS.backgroundColor,
        fillAlpha: MODAL_CONFIGS.backgroundAlpha,
        stroke: MODAL_CONFIGS.strokeColor,
        strokeWidth: MODAL_CONFIGS.strokeWeight,
        round: MODAL_CONFIGS.round,
      },
    });
    background.view.position.set(-background.width / 2, -background.height / 2);
    this.modal.addChild(background.view);

    // setup title text
    this.titleText.text = this._title;
    this.titleText.style.fill = MODAL_CONFIGS.titleStyle.fill;
    this.titleText.style.fontSize = MODAL_CONFIGS.titleStyle.fontSize;
    this.titleText.anchor.set(0, 0);
    this.titleText.position.set(-background.width / 2, -background.height / 2);
    this.modal.addChild(this.titleText);

    // setup content
    this.content.position.set(
      -background.width / 2,
      -background.height / 2 + MODAL_CONFIGS.headerSize
    );
    this.modal.addChild(this.content);

    this.root.visible = false;
  }

  public async show() {
    this.root.visible = true;
    // wiggle modal
    this.root.alpha = 0;
    gsap.to(this.root, { alpha: 1, duration: 0.3 });
    wiggle(this.modal.position);
    globalContext.gameEvents.interfaceEvent.emit('map-selection-pause', {});
    const result = await this.userInteraction();
    await gsap.to(this.root, { alpha: 0, duration: 0.3 });
    globalContext.gameEvents.interfaceEvent.emit('map-selection-resume', {});
    this.root.visible = false;
    return result;
  }

  protected abstract userInteraction(): Promise<boolean>;
}
