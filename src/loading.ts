// const testLoading = async (progress: (rate: number) => void) => {
//   const time = 2000;
//   for (let i = 0; i < 100; i += 1) {
//     progress(i / 100);
//     // eslint-disable-next-line no-await-in-loop
//     await new Promise((resolve) => {
//       setTimeout(resolve, time / 100);
//     });
//   }
// };
import {
  PIXI_TEXTURE_RESOURCES,
  THREE_MODEL_RESOURCES,
  THREE_TEXTURE_RESOURCES,
} from './option/resources';
import { PixiTextureLoader, ThreeModelLoader, ThreeTextureLoader } from './core/GlobalContext';

export type LoadingProps = {
  pixiTextureLoader: PixiTextureLoader;
  threeTextureLoader: ThreeTextureLoader;
  threeModelLoader: ThreeModelLoader;
};

export const loading = async ({
  pixiTextureLoader,
  threeTextureLoader,
  threeModelLoader,
}: LoadingProps) => {
  const loadingDom = document.getElementById('loading');
  const loadingBarEdge = document.getElementById('loading-bar-edge');
  const loadingBar = document.getElementById('loading-bar');

  if (!loadingDom || !loadingBarEdge || !loadingBar) {
    throw new Error('loading elements not found');
  }

  loadingDom.style.display = 'flex';
  loadingDom.style.opacity = '1';

  const loadingRates = {
    pixi: 0,
    threeTex: 0,
    threeModel: 0,
  };
  const updateLoadingBar = () => {
    const rate = (loadingRates.pixi + loadingRates.threeTex + loadingRates.threeModel) / 3;
    loadingBar.style.width = `${Math.floor(rate * 100)}%`;
  };

  await Promise.all([
    pixiTextureLoader.load(PIXI_TEXTURE_RESOURCES, (rate: number) => {
      loadingRates.pixi = rate;
      updateLoadingBar();
    }),
    threeTextureLoader.load(THREE_TEXTURE_RESOURCES, (rate: number) => {
      loadingRates.threeTex = rate;
      updateLoadingBar();
    }),
    threeModelLoader.load(THREE_MODEL_RESOURCES, (rate: number) => {
      loadingRates.threeModel = rate;
      updateLoadingBar();
    }),
  ]);

  // await testLoading((rate) => {
  //   loadingBar.style.width = `${Math.floor(rate * 100)}%`;
  // });

  loadingDom.style.opacity = '0';
  loadingDom.style.display = 'none';
};
