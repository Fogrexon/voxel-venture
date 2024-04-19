import { Text } from 'pixi.js';
import { Modal, MODAL_CONFIGS } from './Modal';
import { TextButton } from '../common/TextButton';

export class Alert extends Modal {
  private _alertText: Text;

  private _okButton: TextButton;

  private _okButtonPressedResolve: ((flag: boolean) => void) | null = null;

  constructor() {
    super('Alert');

    this._alertText = new Text();
    this._alertText.style.wordWrap = true;
    this._alertText.style.wordWrapWidth = MODAL_CONFIGS.contentWidth;
    this._alertText.anchor.set(0, 0);
    this._alertText.position.set(0, 0);
    this.content.addChild(this._alertText);

    this._okButton = new TextButton({
      width: 100,
      height: 50,
      text: 'OK',
    });
    this._okButton.view.position.set(
      MODAL_CONFIGS.contentWidth - 50,
      MODAL_CONFIGS.contentHeight - 25
    );
    this._okButton.button.onPress.connect(() => {
      if (this._okButtonPressedResolve) {
        this._okButtonPressedResolve(true);
        this._okButtonPressedResolve = null;
      }
    });
    this.content.addChild(this._okButton.view);
  }

  protected userInteraction(): Promise<boolean> {
    return new Promise((resolve) => {
      this._okButtonPressedResolve = resolve;
    });
  }

  public setText(text: string) {
    this._alertText.text = text;
  }
}
