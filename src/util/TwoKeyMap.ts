export class TwoKeyMap<Key1, Key2, Value> {
  private map: Map<Key1, Map<Key2, Value>> = new Map();

  public set(key1: Key1, key2: Key2, value: Value): void {
    if (!this.map.has(key1)) {
      this.map.set(key1, new Map());
    }
    this.map.get(key1)!.set(key2, value);
  }

  public get(key1: Key1, key2: Key2): Value | undefined {
    const subMap = this.map.get(key1);
    return subMap?.get(key2);
  }

  public has(key1: Key1, key2: Key2): boolean {
    const subMap = this.map.get(key1);
    return subMap?.has(key2) ?? false;
  }

  public delete(key1: Key1, key2: Key2): boolean {
    const subMap = this.map.get(key1);
    return subMap?.delete(key2) ?? false;
  }

  public iterate(callback: (key1: Key1, key2: Key2, value: Value) => void): void {
    this.map.forEach((subMap, key1) => {
      subMap.forEach((value, key2) => {
        callback(key1, key2, value);
      });
    });
  }
}
