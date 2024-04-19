import { Button } from '@pixi/ui';
import { Graphics } from 'pixi.js';
import { globalContext } from '../../../GlobalContext';

export const createSettingButton = () => {
  const button = new Button(new Graphics().roundRect(0, 0, 50, 50, 15).fill(0x444444));

  button.onPress.connect(() => {
    globalContext.uiController.showScreen('setting');
  });
  button.view.position.set(25, 25);

  return button;
};

export const createOfficeSelectionButton = () => {
  const button = new Button(new Graphics().roundRect(0, 0, 50, 50, 15).fill(0x444444));

  button.onPress.connect(() => {
    globalContext.uiController.showScreen('officeSelect');
  });
  button.view.position.set(75, 25);

  return button;
};
