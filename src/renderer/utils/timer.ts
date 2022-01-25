import { padNumberStart } from "./text";

export class Timer {
  /**
   * Create a new timer factory.
   */
  static create() {
    return new Timer();
  }

  /**
   * Create a timer instance and start it. Uses the provided `ILoggable`
   * to log when the timer is started and stopped.
   *
   * @param message The message to print when the timer starts.
   */
  static start(): TimerInstance {
    return Timer.create().start();
  }

  private constructor() {
    //
  }

  /**
   * Create a timer instance and start it.
   */
  start(): TimerInstance {
    return new TimerInstance(new Date().getTime());
  }
}

export class TimerInstance {
  private static id = 0;

  static nextId() {
    if (TimerInstance.id >= 1000) TimerInstance.id = 0;
    return TimerInstance.id++;
  }

  public readonly id: string;
  private stopTime: number | null = null;

  /**
   * @param startTime The timestamp (milliseconds) at which the timer started.
   */
  constructor(private startTime: number) {
    this.id = `T${padNumberStart(TimerInstance.nextId(), 3)}`;
  }

  /**
   * The timestamp (milliseconds) at which the timer started.
   */
  get startedAt(): number {
    return this.startTime;
  }

  /**
   * The timestamp (milliseconds) at which the timer stopped.
   * Returns `null` if the timer has not been stopped yet.
   */
  get stoppedAt(): number | null {
    return this.stopTime;
  }

  /**
   * The duration of the timer in milliseconds.
   * Returns `null` if the timer has not been stopped yet.
   */
  get duration(): number | null {
    if (!this.stopTime) return null;
    return this.stopTime - this.startTime;
  }

  get durationString(): string | null {
    if (typeof this.duration !== "number") return null;

    const hValue = Math.trunc(this.duration / 1000 / 60 / 60);
    const mValue = Math.trunc((this.duration / 1000 / 60) % 60);
    const sValue = Math.trunc((this.duration / 1000) % 60);
    const msValue = Math.trunc(this.duration % 1000);

    if (hValue > 0) {
      return `${hValue}h ${padNumberStart(mValue, 2)}m`;
    } else if (mValue > 0) {
      return `${mValue}m ${padNumberStart(sValue, 2)}s`;
    } else if (sValue > 0) {
      return `${sValue}.${padNumberStart(msValue, 3)}s`;
    } else {
      return `${msValue}ms`;
    }
  }

  /**
   * Stop the timer and returns the duration. If a `ILoggable` was provided
   * when the timer was created, the duration will be logged.
   *
   * @param message An optional message to print. If not provided, the starting message is printed.
   * @returns The duration in milliseconds.
   */
  stop(): number {
    this.stopTime = new Date().getTime();
    return this.duration!;
  }
}
