export class AssetLoader<T> {
  private _files: Record<string, T> = {};

  private _loader: (path: string) => Promise<T>;

  constructor(loader: (path: string) => Promise<T>) {
    this._loader = loader;
  }

  public async load(files: string[], progress?: (progressRate: number) => void) {
    let loaded = 0;
    const promises = files.map((path: string) =>
      this._loader(path).then((file) => {
        this._files[path] = file;
        loaded += 1;
        if (progress) progress(loaded / files.length);
      })
    );
    return Promise.all(promises);
  }

  public get(path: string): T {
    if (!this._files[path]) {
      throw new Error(`Asset not found: ${path}`);
    }
    return this._files[path];
  }
}
