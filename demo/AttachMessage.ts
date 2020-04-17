import { DynamicMessage, OnReaction } from '../old_src/api';

export class AttachMessage extends DynamicMessage {
  @OnReaction(':thumbsup:')
  public thumbsUp() {
    console.log('Thumbs up');
  }

  public render() {
    return 'Hello';
  }
}
