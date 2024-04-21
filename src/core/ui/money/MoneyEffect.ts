import { Text } from 'pixi.js';
import gsap from 'gsap';

const MONEY_TEXT_CONFIG = {
  fontSize: 20,
  plusFillColor: 0x00ff00,
  plusStrokeColor: 0x005500,
  minusFillColor: 0xff0000,
  minusStrokeColor: 0x550000,
};

export class MoneyEffect {
  public readonly view: Text;

  public get active() {
    return this.view.visible;
  }

  public set active(value: boolean) {
    this.view.visible = value;
  }

  constructor() {
    this.view = new Text({
      text: '0',
      anchor: 0.5,
      style: {
        fill: MONEY_TEXT_CONFIG.plusFillColor,
        stroke: MONEY_TEXT_CONFIG.plusStrokeColor,
        fontSize: MONEY_TEXT_CONFIG.fontSize,
      },
    });
  }

  public reset() {
    this.view.visible = true;
    this.view.alpha = 1;
  }

  public async animate(money: number, position: { x: number; y: number }) {
    if (money > 0) {
      this.view.style.fill = MONEY_TEXT_CONFIG.plusFillColor;
      this.view.style.stroke = MONEY_TEXT_CONFIG.plusStrokeColor;
    } else {
      this.view.style.fill = MONEY_TEXT_CONFIG.minusFillColor;
      this.view.style.stroke = MONEY_TEXT_CONFIG.minusStrokeColor;
    }
    this.view.text = money.toString();
    this.view.position.set(position.x, position.y);

    await gsap.to(this.view, { y: position.y - 50, alpha: 0, duration: 1 });
  }
}
