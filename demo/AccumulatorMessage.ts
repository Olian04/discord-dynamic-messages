import { emoji } from 'node-emoji';
import {
  DynamicMessage,
  OnReaction,
} from '../src/api';

export class AccumulatorMessage extends DynamicMessage {
  private accumulator: string = '';
  constructor() {
    super();
  }

  @OnReaction(':thumbsup:')
  public up() {
    this.accumulator += emoji['+1'];
  }

  @OnReaction(':thumbsdown:')
  public down() {
    this.accumulator += emoji['-1'];
  }

  @OnReaction(':wrench:', {
    hidden: true,
  })
  public hidden_wrench() {
    this.accumulator += emoji.wrench;
  }

  @OnReaction(':angel:')
  public angle() {
    this.accumulator += emoji.angel;
  }

  @OnReaction(':alien:')
  public alien() {
    this.accumulator += emoji.alien;
  }

  public render() {
    return `Accumulator: ${this.accumulator}`;
  }
}
