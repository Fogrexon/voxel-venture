import gsap from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';
import { Texture as PixiTexture } from 'pixi.js';
import { Texture as ThreeTexture, Group } from 'three';
import { Game } from './core/Game';
import { loading } from './loading';
import { screens } from './option/screens';
import { gameParameters } from './option/parameters';
import { AssetLoader } from './core/asset/AssetLoader';
import {
  pixiTextureLoadFunc,
  threeModelLoadFunc,
  threeTextureLoadFunc,
} from './core/asset/loaders';

gsap.registerPlugin(PixiPlugin);

window.addEventListener('load', async () => {
  const pixiTextureLoader = new AssetLoader<PixiTexture>(pixiTextureLoadFunc);
  const threeTextureLoader = new AssetLoader<ThreeTexture>(threeTextureLoadFunc);
  const threeModelLoader = new AssetLoader<Group>(threeModelLoadFunc);

  const uiCanvas = document.getElementById('ui') as HTMLCanvasElement;
  const townCanvas = document.getElementById('town') as HTMLCanvasElement;

  // クエリでpipモードかどうかを指定する
  const urlParams = new URLSearchParams(window.location.search);
  const pipMode = urlParams.get('pipMode') === 'true';

  await loading({
    pixiTextureLoader,
    threeTextureLoader,
    threeModelLoader,
  });

  const game = new Game({
    uiCanvas,
    townCanvas,
    pixiTextureLoader,
    threeTextureLoader,
    threeModelLoader,
    screens,
    initialScreen: 'main',
    pipMode,
    gameParameters,
  });

  game.start();
});
