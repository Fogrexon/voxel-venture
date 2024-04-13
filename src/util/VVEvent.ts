export class VVEvent<T extends Record<string, any>> {
  private _listeners: {
    [K in keyof T]?: Set<(value: T[K]) => void>;
  } = {};

  public on<U extends keyof T>(key: U, listener: (value: T[U]) => void) {
    if (!this._listeners[key]) {
      this._listeners[key] = new Set();
    }
    this._listeners[key]!.add(listener);
  }

  public off<U extends keyof T>(key: U, listener: (value: T[U]) => void) {
    this._listeners[key]?.delete(listener);
  }

  public emit<K extends keyof T>(key: K, value: T[K]) {
    this._listeners[key]?.forEach((listener) => listener(value));
  }
}
