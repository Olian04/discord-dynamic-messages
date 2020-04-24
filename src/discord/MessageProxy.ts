import {
  TextChannel,
  MessageEmbed,
  Message,
  EmojiResolvable,
  MessageReaction,
  User,
  PartialUser,
} from 'discord.js';

type ReactionHandler = (reaction: MessageReaction, user: User | PartialUser) => void;

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
    this.__message = value;
    this.__message.client.on('messageReactionAdd', this.reactionAddedHandler);
    this.__message.client.on('messageReactionRemove', this.reactionRemovedHandler);
  }
  private get message() {
    return this.__message;
  }

  private reactionAddedHandler: ReactionHandler;
  private reactionRemovedHandler: ReactionHandler;

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

  async showReaction(emoji: EmojiResolvable) {
    return this.message.react(emoji)
      .catch(console.error);
  }

  async hideReaction(emoji: EmojiResolvable) {
    return this.message.reactions.cache
      .filter(r => r.emoji.name === emoji)
      .find(r => r.me)
      .remove()
      .catch(console.error);
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