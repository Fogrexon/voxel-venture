import { Container } from 'pixi.js';
import { globalContext } from '../../../GlobalContext';
import { GUIWindow } from '../../common/GUIWindow';

const WINDOW_PARAMS = {
  widthRate: 0.95,
  heightRate: 0.95,
  padding: 10,
  cornerRadius: 10,
};
export const createFullSizeWindow = (content: Container) => {
  const windowWidth = globalContext.windowInfo.width * WINDOW_PARAMS.widthRate;
  const windowHeight = globalContext.windowInfo.height * WINDOW_PARAMS.heightRate;

  const guiWindow = new GUIWindow(content, {
    width: windowWidth,
    height: windowHeight,
    padding: WINDOW_PARAMS.padding,
    // bgImage: Texture.from(globalContext.imageStore.get('ui/window.png')),
  });

  guiWindow.view.position.set(
    (globalContext.windowInfo.width - windowWidth) / 2,
    (globalContext.windowInfo.height - windowHeight) / 2
  );

  return guiWindow;
};
