import { globalContext } from '../GlobalContext';

const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

const CALENDER_CONFIG = {
  secondsParDay: 5,
  startDate: {
    year: 1990,
    month: 1,
    day: 1,
  },
};

export type Timestamp = `${number}-${number}-${number}`;

export class Calender {
  public timeScale: number = 1;

  private _year: number = CALENDER_CONFIG.startDate.year;

  public get year() {
    return this._year;
  }

  private _month: number = CALENDER_CONFIG.startDate.month;

  public get month() {
    return this._month;
  }

  private _day: number = CALENDER_CONFIG.startDate.day;

  public get day() {
    return this._day;
  }

  private _dayRate: number = 0;

  public get dayRate() {
    return this._dayRate;
  }

  public update(deltaTime: number) {
    const scaledTime = (deltaTime * this.timeScale) / CALENDER_CONFIG.secondsParDay;
    this._dayRate += scaledTime;
    if (this._dayRate > 1) {
      this._dayRate -= 1;

      if (this._day + 1 > getDaysInMonth(this._year, this._month)) {
        this._day = 1;
        if (this._month + 1 > 12) {
          this._month = 1;
          this._year += 1;
          globalContext.gameEvents.dataChangedEvent.emit('next-year', {
            year: this._year,
          });
        } else {
          this._month += 1;
        }

        globalContext.gameEvents.dataChangedEvent.emit('next-month', {
          year: this._year,
          month: this._month,
        });
      } else {
        this._day += 1;
      }

      globalContext.gameEvents.dataChangedEvent.emit('next-day', {
        year: this._year,
        month: this._month,
        day: this._day,
      });
    }
  }

  public getCurrentTimestamp(): Timestamp {
    return Calender.createTimestamp(this._year, this._month, this._day);
  }

  public static createTimestamp(year: number, month: number, day: number): Timestamp {
    return `${year}-${month}-${day}`;
  }

  public static parseTimestamp(timestamp: Timestamp) {
    const [year, month, day] = timestamp.split('-').map((v) => parseInt(v, 10));
    return { year, month, day };
  }
}
