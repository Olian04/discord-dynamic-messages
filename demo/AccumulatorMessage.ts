import { MessageReaction, User } from 'discord.js';
import {
  DynamicMessage,
  OnAnyReaction,
  OnAnyReactionRemoved,
  OnInit,
} from '../old_src/api';

export class AccumulatorMessage extends DynamicMessage {
  private addAccumulator: string = '';
  private removeAccumulator: string = '';

  @OnInit
  public init() {
    this.addReactions([
      ':one:', ':two:', ':three:',
    ]);
  }

  @OnAnyReaction()
  public on(user: User, channel, reaction: MessageReaction) {
    if (user.bot) {
      return;
    }
    this.addAccumulator += reaction.emoji.name;
    this.reRender();
  }

  @OnAnyReactionRemoved()
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
