import { Button } from '@pixi/ui';
import { Graphics } from 'pixi.js';
import { globalContext } from '../../../../core/GlobalContext';

export const createSettingButton = () => {
  const button = new Button(new Graphics().roundRect(0, 0, 100, 50, 15).fill(0x444444));

  button.onPress.connect(() => {
    globalContext.uiController.showScreen('setting');
  });
  button.view.position.set(100, 100);

  return button;
};
