import { TextChannel, MessageEmbed, Message, EmojiResolvable } from 'discord.js';

/**
 * MessageProxy exists to limit the amount of discord.js implementation details
 * that are being leaked into the core of the library.
 * We want to keep as much of the discord.js specific logic
 * separate from the core library as possible.
 * This is to minimize the amount of code that needs to be re-written
 * if the discord.js api changes.
 */
export class MessageProxy {
  private message: Message;

  async addReaction(emoji: EmojiResolvable) {
    console.log(emoji);
    return this.message.react(emoji)
      .catch(console.error);
  }

  async sendToChannel(channel: TextChannel, initialContent: string | MessageEmbed) {
    return channel.send(initialContent)
      .then(message => {
        this.message = message;
      })
      .catch(console.error);
  };
}