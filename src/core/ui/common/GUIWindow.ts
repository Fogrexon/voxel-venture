import { Container, Graphics, Rectangle, Sprite, Texture } from 'pixi.js';

export type GUIWindowOptions = {
  width: number;
  height: number;
  padding: number;
  bgImage?: Texture;
  bgTile?: Texture;
  bgTileSrcWidth?: number;
  bgTileWidth?: number;
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

  protected _options: GUIWindowOptions;

  constructor(content: Container, options: GUIWindowOptions) {
    this._options = options;
    this._content = content;
    this.createBackground();
  }

  private createBackground() {
    const bg = new Container();
    const { width, height, padding, bgImage, bgTile, bgTileSrcWidth, bgTileWidth } = this._options;

    if (bgImage) {
      const bgSprite = new Sprite(bgImage);
      bgSprite.width = width;
      bgSprite.height = height;
      bg.addChild(bgSprite);
    } else if (bgTile && bgTileSrcWidth && bgTileWidth) {
      const bgTileCenterWidth = bgTile.width - bgTileSrcWidth * 2;

      // region 9-slice
      const top = Sprite.from(
        new Texture({
          source: bgTile.source,
          frame: new Rectangle(bgTileSrcWidth, 0, bgTileCenterWidth, bgTileSrcWidth),
        })
      );

      const upperRight = Sprite.from(
        new Texture({
          source: bgTile.source,
          frame: new Rectangle(
            bgTileSrcWidth + bgTileCenterWidth,
            0,
            bgTileSrcWidth,
            bgTileSrcWidth
          ),
        })
      );

      const right = Sprite.from(
        new Texture({
          source: bgTile.source,
          frame: new Rectangle(
            bgTileSrcWidth + bgTileCenterWidth,
            bgTileSrcWidth,
            bgTileSrcWidth,
            bgTileCenterWidth
          ),
        })
      );

      const lowerRight = Sprite.from(
        new Texture({
          source: bgTile.source,
          frame: new Rectangle(
            bgTileSrcWidth + bgTileCenterWidth,
            bgTileSrcWidth + bgTileCenterWidth,
            bgTileSrcWidth,
            bgTileSrcWidth
          ),
        })
      );

      const bottom = Sprite.from(
        new Texture({
          source: bgTile.source,
          frame: new Rectangle(
            bgTileSrcWidth,
            bgTileSrcWidth + bgTileCenterWidth,
            bgTileCenterWidth,
            bgTileSrcWidth
          ),
        })
      );

      const lowerLeft = Sprite.from(
        new Texture({
          source: bgTile.source,
          frame: new Rectangle(
            0,
            bgTileSrcWidth + bgTileCenterWidth,
            bgTileSrcWidth,
            bgTileSrcWidth
          ),
        })
      );

      const left = Sprite.from(
        new Texture({
          source: bgTile.source,
          frame: new Rectangle(0, bgTileSrcWidth, bgTileSrcWidth, bgTileCenterWidth),
        })
      );

      const upperLeft = Sprite.from(
        new Texture({
          source: bgTile.source,
          frame: new Rectangle(0, 0, bgTileSrcWidth, bgTileSrcWidth),
        })
      );

      const center = Sprite.from(
        new Texture({
          source: bgTile.source,
          frame: new Rectangle(
            bgTileSrcWidth,
            bgTileSrcWidth,
            bgTileCenterWidth,
            bgTileCenterWidth
          ),
        })
      );

      // endregion 9-slice

      // region 9-slice set size and position
      top.setSize(width - bgTileWidth * 2, bgTileWidth);
      top.position.set(bgTileWidth, 0);
      upperRight.setSize(bgTileWidth, bgTileWidth);
      upperRight.position.set(width - bgTileWidth, 0);
      right.setSize(bgTileWidth, height - bgTileWidth * 2);
      right.position.set(width - bgTileWidth, bgTileWidth);
      lowerRight.setSize(bgTileWidth, bgTileWidth);
      lowerRight.position.set(width - bgTileWidth, height - bgTileWidth);
      bottom.setSize(width - bgTileWidth * 2, bgTileWidth);
      bottom.position.set(bgTileWidth, height - bgTileWidth);
      lowerLeft.setSize(bgTileWidth, bgTileWidth);
      lowerLeft.position.set(0, height - bgTileWidth);
      left.setSize(bgTileWidth, height - bgTileWidth * 2);
      left.position.set(0, bgTileWidth);
      upperLeft.setSize(bgTileWidth, bgTileWidth);
      upperLeft.position.set(0, 0);
      center.setSize(width - bgTileWidth * 2, height - bgTileWidth * 2);
      center.position.set(bgTileWidth, bgTileWidth);

      // endregion 9-slice set size and position

      bg.addChild(top);
      bg.addChild(upperRight);
      bg.addChild(right);
      bg.addChild(lowerRight);
      bg.addChild(bottom);
      bg.addChild(lowerLeft);
      bg.addChild(left);
      bg.addChild(upperLeft);
      bg.addChild(center);
    } else {
      const bgGraphic = new Graphics();
      bgGraphic.rect(0, 0, width, height);
      bgGraphic.fill(0xbbbbbb);
      bgGraphic.stroke(0x000000);

      bg.addChild(bgGraphic);
    }

    this._view.addChild(bg);
    this._content.position.set(padding, padding);
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
