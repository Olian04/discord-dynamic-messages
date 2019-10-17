import {
  DMChannel,
  GroupDMChannel,
  Message,
  MessageReaction,
  RichEmbed, TextChannel,
  User,
} from 'discord.js';
import emojiUtils from 'node-emoji';
import { IDynamicMessageConfig, IMetadata } from './interfaces';
import { metadata } from './manageMetadata';
import { checkPermissions } from './util/checkPermission';
import { throwError } from './util/throwError';

export abstract class DynamicMessage {
  private isResponse: boolean = false;
  private responseTo: User = null;
  private metadata: IMetadata;
  private config: IDynamicMessageConfig;
  private __message: Message = null;

  public set message(newMessage: Message) {
    if (this.__message !== null) {
      // We're currently not cleaning up any side effects from "setupReactionCollector" so we cant reassign the message
      throwError(this.config, `DynamicMessage#message may not be reassigned once assigned!`);
    }

    checkPermissions(this.config, newMessage.guild);

    this.__message =  newMessage;
    this.setupReactionCollector();
  }
  public get message() {
    return this.__message;
  }

  constructor(config: IDynamicMessageConfig = { volatile: true }) {
    this.config = config;

    // Pull in metadata config defined in decorators
    this.metadata = metadata.get(this);
  }

  public async sendTo(channel: TextChannel | DMChannel | GroupDMChannel) {
    this.message = (await channel.send(this.render())) as Message;
    return this;
  }

  public async replyTo(msg: Message) {
    this.message = (await msg.reply(this.render())) as Message;
    this.isResponse = true;
    this.responseTo = msg.author;
    return this;
  }

  public reRender() {
    if (this.isResponse) {
      this.message.edit(`${this.responseTo} ${this.render()}`);
    } else {
      this.message.edit(this.render());
    }
  }

  protected abstract render(): string | RichEmbed;

  private setupReactionCollector = async () => {
    await Object.keys(this.metadata.reactionHandlers)
      .filter((emojiCode) => !this.metadata.reactionHandlers[emojiCode].config.hidden)
      .sort((a, b) =>
        this.metadata.reactionHandlers[a].registrationOrder - this.metadata.reactionHandlers[b].registrationOrder,
      )
      .map((emojiCode) => emojiUtils.get(emojiCode))
      .reduce((promise, emoji) => promise.then(() => this.message.react(emoji)), Promise.resolve());

    const collector = this.message.createReactionCollector(
      (reaction: MessageReaction) => emojiUtils.unemojify(reaction.emoji.name) in this.metadata.reactionHandlers,
    );

    collector.on('collect', (reaction: MessageReaction) => {
      const emojiCode = emojiUtils.unemojify(reaction.emoji.name);
      reaction.users
        .filter((user) => {
          const { ignoreBots, ignoreHumans } = this.metadata.reactionHandlers[emojiCode].config;
          if (user.bot) {
            return !ignoreBots;
          } else {
            return !ignoreHumans;
          }
        })
        .forEach((user) => {
          const { handlerKey, config: { removeWhenDone } } = this.metadata.reactionHandlers[emojiCode];
          this[handlerKey](user, this.message.channel, reaction);

          if (removeWhenDone) {
            reaction.remove(user);
          }
        });

      if (this.metadata.reactionHandlers[emojiCode].config.triggerRender) {
        this.reRender();
      }
    });
  }
}
