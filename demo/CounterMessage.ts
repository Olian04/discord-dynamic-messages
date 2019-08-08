import {
  DynamicMessage,
  OnReaction,
} from '../src/index';

export class CounterMessage extends DynamicMessage {
  private counter;
  constructor(args) {
    super();
    this.counter = args.initialCounterValue;
  }

  @OnReaction(':thumbsup:')
  public increment(user, channel) {
    this.counter += 1;
  }

  @OnReaction(':thumbsdown:')
  public decrement(user, channel) {
    this.counter -= 1;
  }

  public render() {
    return `Counter: ${this.counter}`;
  }
}
