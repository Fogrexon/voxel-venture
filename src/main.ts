import { Game } from './core/Game';
import { loading } from './loading';
import { ImageStore } from './core/asset/ImageStore';

window.addEventListener('load', async () => {
  const imageStore = new ImageStore();

  const uiCanvas = document.getElementById('ui') as HTMLCanvasElement;
  const townCanvas = document.getElementById('town') as HTMLCanvasElement;

  const game = new Game({
    uiCanvas,
    townCanvas,
    imageStore,
    screens: {},
  });

  await loading([], imageStore);

  game.start();
});
