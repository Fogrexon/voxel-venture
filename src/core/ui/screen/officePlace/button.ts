import { Container, Graphics, Text } from 'pixi.js';

export const createOfficeButton = (text: string, onClick: () => void): Container => {
  const button = new Container();
  const bg = new Graphics().rect(0, 0, 100, 50).fill(0x444444);
  button.addChild(bg);
  const label = new Text({
    text,
    style: {
      fill: 0xffffff,
    },
  });
  label.position.set(50, 25);
  label.anchor.set(0.5);
  button.addChild(label);
  button.interactive = true;
  button.on('pointertap', onClick);
  return button;
};
