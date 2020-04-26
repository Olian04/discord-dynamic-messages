import {
  TextChannel,
  MessageEmbed,
  Message,
  EmojiResolvable,
  MessageReaction,
  User,
  PartialUser,
} from 'discord.js';
import { find } from 'node-emoji';

type ReactionHandler = (reaction: MessageReaction, user: User) => void;
type LifecycleHandler = () => void;

/**
 * MessageProxy exists to limit the amount of discord.js implementation details
 * that are being leaked into the core of the library.
 * We want to keep as much of the discord.js specific logic
 * separate from the core library as possible.
 * This is to minimize the amount of code that needs to be re-written
 * if the discord.js api changes.
 */
export class MessageProxy {
  private __message: Message;
  private set message(value) {
    if (this.__message && this.messageDetachedHandler) {
      this.messageDetachedHandler();
    }
    this.__message = value;
    if (this.__message === null) return;
    this.__message.client.on('messageReactionAdd', this.reactionAddedHandler);
    this.__message.client.on('messageReactionRemove', this.reactionRemovedHandler);
    if (this.messageAttachedHandler) {
      this.messageAttachedHandler();
    }
  }
  private get message() {
    return this.__message;
  }

  private reactionAddedHandler: ReactionHandler;
  private reactionRemovedHandler: ReactionHandler;
  private messageAttachedHandler: LifecycleHandler;
  private messageDetachedHandler: LifecycleHandler;

  public get guild() {
    return this.message.guild;
  }
  public get channel() {
    return this.message.channel;
  }

  detachMessage() {
    this.message = null;
  }

  onMessageAttached(handler: LifecycleHandler) {
    this.messageAttachedHandler = handler;
  }
  onMessageDetached(handler: LifecycleHandler) {
    this.messageAttachedHandler = handler;
  }

  onReactionAdded(handler: ReactionHandler) {
    this.reactionAddedHandler = (reaction, user) => {
      const target =  reaction.message;
      if (target.id !== this.__message.id) return;
      handler(reaction, user);;
    };
  }
  onReactionRemoved(handler: ReactionHandler) {
    this.reactionRemovedHandler = (reaction, user) => {
      const target =  reaction.message;
      if (target.id !== this.__message.id) return;
      handler(reaction, user);;
    };
  }

  async showReaction(emoji: string) {
    return this.message.react(emoji)
      .catch(console.error);
  }

  async hideReaction(emoji: string) {
    return this.removeReaction(this.message.author, emoji);
  }

  async removeReaction(user: User, emoji: string) {
    const maybeReaction = (await this.message.fetch()).reactions.cache
      .find(r => r.emoji.name === emoji);

    if (maybeReaction) {
      maybeReaction.users
        .remove(user)
        .catch(console.error);
    }
  }

  async updateContents(content: string, embed: MessageEmbed) {
    this.message.edit(content, { embed });
  }

  async sendToChannel(channel: TextChannel, initialContent: string | MessageEmbed) {
    return channel.send(initialContent)
      .then(message => {
        this.message = message;
      })
      .catch(console.error);
  };
}