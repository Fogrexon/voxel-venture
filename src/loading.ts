import { ImageStore } from './core/asset/ImageStore';

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

export const loading = async (imagePaths: string[], imageStore: ImageStore) => {
  const loadingDom = document.getElementById('loading');
  const loadingBarEdge = document.getElementById('loading-bar-edge');
  const loadingBar = document.getElementById('loading-bar');

  if (!loadingDom || !loadingBarEdge || !loadingBar) {
    throw new Error('loading elements not found');
  }

  loadingDom.style.display = 'flex';
  loadingDom.style.opacity = '1';

  await imageStore.loadImages(imagePaths, (rate) => {
    loadingBar.style.width = `${Math.floor(rate * 100)}%`;
  });

  // await testLoading((rate) => {
  //   loadingBar.style.width = `${Math.floor(rate * 100)}%`;
  // });

  loadingDom.style.opacity = '0';
  loadingDom.style.display = 'none';
};
