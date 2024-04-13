import gsap from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';
import { Game } from './core/Game';
import { loading } from './loading';
import { ImageStore } from './core/asset/ImageStore';
import { IMAGE_RESOURCES } from './option/resources';
import { screens } from './option/screens';
import { gameParameters } from './option/parameters';

gsap.registerPlugin(PixiPlugin);

window.addEventListener('load', async () => {
  const imageStore = new ImageStore();

  const uiCanvas = document.getElementById('ui') as HTMLCanvasElement;
  const townCanvas = document.getElementById('town') as HTMLCanvasElement;

  // クエリでpipモードかどうかを指定する
  const urlParams = new URLSearchParams(window.location.search);
  const pipMode = urlParams.get('pipMode') === 'true';

  await loading(IMAGE_RESOURCES, imageStore);

  const game = new Game({
    uiCanvas,
    townCanvas,
    imageStore,
    screens,
    initialScreen: 'main',
    pipMode,
    gameParameters,
  });

  game.start();
});
