import { Text } from 'pixi.js';
import { Modal, MODAL_CONFIGS } from './Modal';
import { TextButton } from '../common/TextButton';

export class Confirm extends Modal {
  private _confirmText: Text;

  private _okButton: TextButton;

  private _cancelButton: TextButton;

  private _okButtonPressedResolve: ((flag: boolean) => void) | null = null;

  constructor() {
    super('Confirm');

    this._confirmText = new Text();
    this._confirmText.style.wordWrap = true;
    this._confirmText.style.wordWrapWidth = MODAL_CONFIGS.contentWidth;
    this._confirmText.anchor.set(0, 0);
    this._confirmText.position.set(0, 0);
    this.content.addChild(this._confirmText);

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

    this._cancelButton = new TextButton({
      width: 100,
      height: 50,
      text: 'Cancel',
    });
    this._cancelButton.view.position.set(
      MODAL_CONFIGS.contentWidth - 150,
      MODAL_CONFIGS.contentHeight - 25
    );
    this._cancelButton.button.onPress.connect(() => {
      if (this._okButtonPressedResolve) {
        this._okButtonPressedResolve(false);
        this._okButtonPressedResolve = null;
      }
    });
    this.content.addChild(this._cancelButton.view);
  }

  protected userInteraction(): Promise<boolean> {
    return new Promise((resolve) => {
      this._okButtonPressedResolve = resolve;
    });
  }

  public setText(text: string) {
    this._confirmText.text = text;
  }
}
