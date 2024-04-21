import { Texture as PixiTexture } from 'pixi.js';
import { Group, Texture as ThreeTexture } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const fbxLoader = new FBXLoader();

export const pixiTextureLoadFunc = (path: string): Promise<PixiTexture> =>
  new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const texture = PixiTexture.from(image);
      resolve(texture);
    };
    image.src = path;
  });

export const threeTextureLoadFunc = (path: string): Promise<ThreeTexture> =>
  new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const texture = new ThreeTexture(image);
      texture.needsUpdate = true;
      resolve(texture);
    };
    image.src = path;
  });

export const threeModelLoadFunc = (path: string): Promise<Group> =>
  new Promise((resolve) => {
    fbxLoader.load(path, (model) => {
      resolve(model);
    });
  });
