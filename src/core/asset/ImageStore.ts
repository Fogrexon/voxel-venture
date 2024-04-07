const loadImage = (path: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = path;
  });

/**
 * 画像ファイルのロードを管理するクラス
 */
export class ImageStore {
  private files: Record<string, HTMLImageElement> = {};

  public async loadImages(files: string[], progress?: (progressRate: number) => void) {
    let loaded = 0;
    const promises = files.map((path: string) =>
      loadImage(path).then((image) => {
        this.files[path] = image;
        loaded += 1;
        if (progress) progress(loaded / files.length);
      })
    );
    return Promise.all(promises);
  }

  public getImage(path: string): HTMLImageElement {
    if (!this.files[path]) {
      throw new Error(`Image not found: ${path}`);
    }
    return this.files[path];
  }
}
