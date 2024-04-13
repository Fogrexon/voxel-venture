import { Sprite, Texture } from 'pixi.js';
import { Button } from '@pixi/ui';
import { globalContext } from '../../../core/GlobalContext';

export const createCloseButton = () => {
  const closeButtonTexture = Texture.from(globalContext.imageStore.get('ui/cross.png'));
  const closeButtonGraphic = Sprite.from(closeButtonTexture);
  closeButtonGraphic.position.set(0, 0);
  closeButtonGraphic.anchor.set(0.5, 0.5);
  closeButtonGraphic.setSize(50, 50);

  const closeButton = new Button(closeButtonGraphic);

  closeButton.onPress.connect(() => {
    globalContext.uiController.showScreen('main');
  });

  return closeButton;
};
