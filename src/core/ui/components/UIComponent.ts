import { Graphics } from 'pixi.js';

/**
 * UIコンポーネントの基礎クラス
 */
export abstract class UIComponent {
  private _id: string;

  public get id(): string {
    return this._id;
  }

  // eslint-disable-next-line no-use-before-define
  private _children: UIComponent[] = [];

  private _graphics: Graphics;

  public get graphics(): Graphics {
    return this._graphics;
  }

  protected constructor() {
    this._graphics = this.createUIGraphics();
    this._id = Math.random().toString(32).substring(2);
  }

  protected abstract createUIGraphics(): Graphics;

  public add(component: UIComponent) {
    this._graphics.addChild(component.graphics);
    this._children.push(component);
  }

  public remove(component: UIComponent) {
    this._graphics.removeChild(component.graphics);
    this._children = this._children.filter((child) => child.id !== component.id);
  }
}
