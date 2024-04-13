export class VVEvent<T extends Record<string, any>> {
  private _listeners: {
    [K in keyof T]?: Set<(value: T[K]) => void>;
  } = {};

  public on(key: keyof T, listener: (value: T[typeof key]) => void) {
    if (!this._listeners[key]) {
      this._listeners[key] = new Set();
    }
    this._listeners[key]!.add(listener);
  }

  public off(key: keyof T, listener: (value: T[typeof key]) => void) {
    this._listeners[key]?.delete(listener);
  }

  public emit<K extends keyof T>(key: K, value: T[K]) {
    this._listeners[key]?.forEach((listener) => listener(value));
  }
}
