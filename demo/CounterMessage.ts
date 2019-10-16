import {
  DynamicMessage,
  OnReaction,
} from '../src/api';

export class CounterMessage extends DynamicMessage {
  private counter;
  constructor(args: { initialCounterValue: number; }) {
    super();
    this.counter = args.initialCounterValue;
  }

  @OnReaction(':thumbsup:')
  public increment() {
    this.counter += 1;
  }

  @OnReaction(':thumbsdown:')
  public decrement() {
    this.counter -= 1;
  }

  public render() {
    return `Counter: ${this.counter}`;
  }
}
