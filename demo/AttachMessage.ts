import { DynamicMessage, OnReaction } from '../src/api';

export class AttachMessage extends DynamicMessage {
  @OnReaction(':thumbsup:')
  public thumbsUp() {
    console.log('Thumbs up');
  }

  public render() {
    return 'Hello';
  }
}
