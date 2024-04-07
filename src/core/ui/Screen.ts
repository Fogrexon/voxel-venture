export abstract class Screen {
  public abstract show(): Promise<void>;

  public abstract hide(): Promise<void>;
}
