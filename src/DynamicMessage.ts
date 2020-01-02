import {
  Client,
  DMChannel,
  GroupDMChannel,
  Message,
  MessageReaction, ReactionCollector,
  RichEmbed,
  TextChannel,
  User,
} from 'discord.js';
import emojiUtils from 'node-emoji';
import { IDynamicMessageConfig } from './interfaces/IDynamicMessageConfigTame';
import { IMetadata } from './interfaces/IMetadata';
import { metadata } from './manageMetadata';
import { checkPermissions } from './util/checkPermission';
import { throwError } from './util/throwError';

export abstract class DynamicMessage {

  public set message(newMessage: Message) {
    if (this.__message !== null) {
      this.tearDownReactionCollector();
    }
    if (newMessage === null) {
      this.__message = null;
      return;
    }

    checkPermissions(this.config, newMessage.guild);

    this.__message =  newMessage;
    this.setupReactionCollector();
  }
  public get message() {
    return this.__message;
  }

  private isResponse: boolean = false;
  private responseTo: User = null;
  private metadata: IMetadata;
  private config: IDynamicMessageConfig;
  private reactionCollector: ReactionCollector;
  private __message: Message = null;

  /*
  Apparently discord has some problems with certain emoji
  ex: :one: needs to be sent in and escaped unicode format: \u0030\u20E3

  See:
    - https://stackoverflow.com/questions/49225971/discord-js-message-react-fails-when-adding-specific-unicode-emotes
    - https://github.com/discordjs/discord.js/issues/2287
  */
  private emojiFixes = {
    ':zero:': '\u0030\u20E3',
    ':one:': '\u0031\u20E3',
    ':two:': '\u0032\u20E3',
    ':three:': '\u0033\u20E3',
    ':four:': '\u0034\u20E3',
    ':five:': '\u0035\u20E3',
    ':six:': '\u0036\u20E3',
    ':seven:': '\u0037\u20E3',
    ':eight:': '\u0038\u20E3',
    ':nine:': '\u0039\u20E3',
  };

  constructor(config: IDynamicMessageConfig = { volatile: true }) {
    this.config = config;
    this.handleReactionRemoved = this.handleReactionRemoved.bind(this);

    // Pull in metadata config defined in decorators
    this.metadata = metadata.get(this);
  }

  public async sendTo(channel: TextChannel | DMChannel | GroupDMChannel) {
    try {
      this.message = (await channel.send(this.render())) as Message;
    } catch (err) {
      throwError(this.config, String(err));
    }
    return this;
  }

  public async replyTo(msg: Message) {
    try {
      this.message = (await msg.reply(this.render())) as Message;
      this.isResponse = true;
      this.responseTo = msg.author;
    } catch (err) {
      throwError(this.config, String(err));
    }
    return this;
  }

  public attachTo(message: Message, responseTo?: User) {
    try {
      this.message = message;
      if (responseTo) {
        this.isResponse = true;
        this.responseTo = responseTo;
      }
    } catch (err) {
      throwError(this.config, String(err));
    }
    this.reRender();
    return this;
  }

  public reRender() {
    if (this.isResponse) {
      this.message.edit(`${this.responseTo} ${this.render()}`)
        .catch((err) => throwError(this.config, String(err)));
    } else {
      this.message.edit(this.render())
        .catch((err) => throwError(this.config, String(err)));
    }
  }

  protected abstract render(): string | RichEmbed;

  private async tearDownReactionCollector() {
    try {
      await this.message.clearReactions();
      this.reactionCollector.removeAllListeners()
        .cleanup();
      this.message.client.off('messageReactionRemove', this.handleReactionRemoved);
    } catch (err) {
      throwError(this.config, String(err));
    }
  }

  private setupReactionCollector = async () => {
    try {
      // Setup known "none-hidden" reactions on the message
      await Object.keys(this.metadata.reactionHandlers)
        .filter((emojiCode) => !this.metadata.reactionHandlers[emojiCode].config.hidden)
        .sort((a, b) =>
          this.metadata.reactionHandlers[a].registrationOrder - this.metadata.reactionHandlers[b].registrationOrder,
        )
        .map((emojiCode) => emojiCode in this.emojiFixes ?
          this.emojiFixes[emojiCode] : emojiUtils.get(emojiCode),
        )
        .reduce((promise, emoji) => promise.then(() => this.message.react(emoji)), Promise.resolve());

      // Setup reaction collector for known emoji
      this.reactionCollector = this.message.createReactionCollector(
        () => true,
      );

      this.message.client.on('messageReactionRemove', this.handleReactionRemoved);

      // Setup reaction handler for new reactions
      this.reactionCollector.on('collect', (reaction) => this.handleReaction(reaction, false));

      // Retroactively handle reaction already on the message
      this.message.reactions.forEach((reaction) => this.handleReaction(reaction, true));
    } catch (err) {
      throwError(this.config, String(err));
    }
  }

  private handleReactionRemoved(reaction: MessageReaction, user: User) {
    const filter = ({ ignoreBots, ignoreHumans }: { ignoreBots: boolean; ignoreHumans: boolean }) => {
      if (user.bot) {
        return !ignoreBots;
      } else {
        return !ignoreHumans;
      }
    };

    try {
      if (reaction.message.id !== this.message.id) {
        // Not this message
        return;
      }

      if (this.metadata.catchAllReactionRemovedHandler) {
        const {
          handlerKey: catchAllHandlerKey,
        } = this.metadata.catchAllReactionRemovedHandler;

        this[catchAllHandlerKey](user, this.message.channel, reaction);
      }

      const emojiCode = emojiUtils.unemojify(reaction.emoji.name);
      if (! (emojiCode in this.metadata.reactionRemovedHandlers)) {
        // No registered handler
        return;
      }

      const {
        handlerKey,
        config: {
          ignoreBots,
          ignoreHumans,
          triggerRender,
        },
      } = this.metadata.reactionRemovedHandlers[emojiCode];

      if (!filter({ ignoreBots, ignoreHumans })) {
        return;
      }
      this[handlerKey](user, this.message.channel, reaction);

      if (triggerRender) {
        this.reRender();
      }
    } catch (err) {
      throwError(this.config, String(err));
    }
  }

  private async handleReaction(reaction: MessageReaction, isRetroactive: boolean) {
    const filter = (user, { ignoreBots, ignoreHumans }: { ignoreBots: boolean; ignoreHumans: boolean }) => {
      if (user.bot) {
        return !ignoreBots;
      } else {
        return !ignoreHumans;
      }
    };

    try {
      if (this.metadata.catchAllReactionHandler) {
        const {
          handlerKey: catchAllHandlerKey,
        } = this.metadata.catchAllReactionHandler;

        (await reaction.fetchUsers()).forEach((user) => {
          this[catchAllHandlerKey](user, this.message.channel, reaction);
        });
      }

      if (! (emojiUtils.unemojify(reaction.emoji.name) in this.metadata.reactionHandlers)) {
        return;
      }

      const emojiCode = emojiUtils.unemojify(reaction.emoji.name);
      const {
        handlerKey,
        config: {
          removeWhenDone,
          ignoreBots,
          ignoreHumans,
          doRetroactiveCallback,
          triggerRender,
        },
      } = this.metadata.reactionHandlers[emojiCode];

      if (isRetroactive && !doRetroactiveCallback) {
        // No retroactive callback should be applied
        return;
      }

      // fetchUsers is needed for retroactive callback application
      const users = await reaction.fetchUsers();
      users.filter((user) => filter(user, { ignoreBots, ignoreHumans }))
        .forEach((user) => {
          this[handlerKey](user, this.message.channel, reaction);

          if (removeWhenDone) {
            reaction.remove(user);
          }
        });

      if (triggerRender) {
        this.reRender();
      }
    } catch (err) {
      throwError(this.config, String(err));
    }
  }
}
