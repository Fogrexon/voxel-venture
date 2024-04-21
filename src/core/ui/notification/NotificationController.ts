import { Notification } from './Notification';
import { Queue } from '../../../util/Queue';

export type NotificationData = {
  text: string;
};

export class NotificationController {
  private _notification: Notification;

  public get view() {
    return this._notification.view;
  }

  private _notificationQueue: Queue<NotificationData>;

  private _isNotificationShowing: boolean = false;

  constructor() {
    this._notification = new Notification();
    this._notificationQueue = new Queue();
  }

  public init() {
    this._notification.init();
  }

  public addNotification(notificationData: NotificationData) {
    this._notificationQueue.enqueue(notificationData);
    if (!this._isNotificationShowing) {
      this.showNotification();
    }
  }

  private async showNotification() {
    this._isNotificationShowing = true;
    let queueData = this._notificationQueue.dequeue();
    while (queueData) {
      // eslint-disable-next-line no-await-in-loop
      await this._notification.show(queueData.text);
      queueData = this._notificationQueue.dequeue();
    }
    this._isNotificationShowing = false;
  }
}
