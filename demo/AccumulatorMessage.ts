import { MessageReaction, ReactionEmoji, User } from 'discord.js';
import {
  DynamicMessage,
  OnReaction,
  OnReactionRemoved,
} from '../src/api';

export class AccumulatorMessage extends DynamicMessage {
  private addAccumulator: string = '';
  private removeAccumulator: string = '';

  @OnReaction(':three:', { removeWhenDone: false })
  @OnReaction(':two:', { removeWhenDone: false })
  @OnReaction(':one:', { removeWhenDone: false })
  public placeholder() { /* NOP */ }

  @OnReaction()
  public on(user: User, channel, reaction: MessageReaction) {
    if (user.bot) {
      return;
    }
    this.addAccumulator += reaction.emoji.name;
    this.reRender();
  }

  @OnReactionRemoved()
  public off(user: User, channel, reaction: MessageReaction) {
    if (user.bot) {
      return;
    }
    this.removeAccumulator += reaction.emoji.name;
    this.reRender();
  }

  public render() {
    return `AddAccumulator: ${this.addAccumulator}\nRemoveAccumulator: ${this.removeAccumulator}\n`;
  }
}
