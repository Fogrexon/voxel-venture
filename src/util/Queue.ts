export class Queue<T> {
  private _queue: T[] = [];

  public enqueue(item: T): void {
    this._queue.push(item);
  }

  public dequeue(): T | undefined {
    return this._queue.shift();
  }

  public get length(): number {
    return this._queue.length;
  }

  public iterate(callback: (item: T) => void): void {
    this._queue.forEach(callback);
  }
}
