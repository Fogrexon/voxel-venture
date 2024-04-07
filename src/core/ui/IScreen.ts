import { Container } from 'pixi.js';

export interface IScreen {
  root: Container;
  show(): Promise<void>;
  hide(): Promise<void>;
}
