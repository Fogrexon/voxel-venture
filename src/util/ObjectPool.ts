export type ObjectPoolOptions<T> = {
  create: () => T;
  checkActive: (obj: T) => boolean;
  reset: (obj: T) => void;
  maxPoolSize?: number;
};

export class ObjectPool<T> {
  private _create: () => T;

  private _checkActive: (obj: T) => boolean;

  private _reset: (obj: T) => void;

  private _pool: T[] = [];

  private _maxPoolSize: number | undefined;

  constructor(options: ObjectPoolOptions<T>) {
    this._create = options.create;
    this._checkActive = options.checkActive;
    this._reset = options.reset;
    this._maxPoolSize = options.maxPoolSize;
  }

  public getInstance() {
    for (let i = 0; i < this._pool.length; i += 1) {
      const obj = this._pool[i];
      if (!this._checkActive(obj)) {
        this._reset(obj);
        this._pool.splice(i, 1);
        this._pool.push(obj);
        return obj;
      }
    }

    if (this._maxPoolSize && this._pool.length >= this._maxPoolSize) {
      const obj = this._pool.shift();
      if (obj) {
        this._reset(obj);
        this._pool.push(obj);
        return obj;
      }
      throw new Error('Max pool size is 0');
    } else {
      const obj = this._create();
      this._pool.push(obj);
      return obj;
    }
  }
}
