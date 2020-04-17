import {
  DynamicMessage,
  OnReaction,
} from '../old_src/api';

export class NumericEmojiMessage extends DynamicMessage {
  private counter = 0;

  @OnReaction(':one:')
  public increment() {
    this.counter = 1;
  }

  @OnReaction(':two:')
  public decrement() {
    this.counter = 2;
  }

  public render() {
    return `Number: ${this.counter}`;
  }
}
