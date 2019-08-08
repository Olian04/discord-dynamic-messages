import { DMChannel, GroupDMChannel, Message, MessageReaction, RichEmbed, TextChannel, User } from 'discord.js';
import emojiUtils from 'node-emoji';
import 'reflect-metadata';

async function awaitAllInOrder(array) {
  for (const promise of array) {
    await promise;
  }
}

interface IReactionConfig {
  hidden: boolean;
  triggerRender: boolean;
  removeWhenDone: boolean;
  ignoreBots: boolean;
  ignoreHumans: boolean;
}

interface IMetadata {
  numberOfRegisteredReactionHandlers: number;
  reactionHandlers: {
    [emoji: string]: {
      registrationOrder: number;
      handlerKey: string;
      config: IReactionConfig;
    };
  };
}

const PROPERTY_METADATA_KEY = Symbol('propertyMetadata');
const initialMetadata = (): IMetadata => ({
  reactionHandlers: {},
  numberOfRegisteredReactionHandlers: 0,
});
const defaultReactionConfig = (): IReactionConfig => ({
  hidden: false,
  triggerRender: true,
  removeWhenDone: true,
  ignoreBots: true,
  ignoreHumans: false,
});

const updateMetadata = (target, cb: (metadata: IMetadata) => IMetadata) => {
  // Pull the existing metadata or create an empty object
  let allMetadata: IMetadata = (
    Reflect.getMetadata(PROPERTY_METADATA_KEY, target)
    || initialMetadata()
  );

  allMetadata = cb(allMetadata);

  // Update the metadata
  Reflect.defineMetadata(
    PROPERTY_METADATA_KEY,
    allMetadata,
    target,
  );
};

export const OnReaction = (emoji: string, config: Partial<IReactionConfig> = {}) =>
  (target, propertyKey: string, descriptor: PropertyDescriptor) => {
  updateMetadata(target, (allMetadata) => {

    // Add the reaction handler to the instance meta data
    allMetadata.reactionHandlers[emoji] = {
      registrationOrder: allMetadata.numberOfRegisteredReactionHandlers,
      handlerKey: propertyKey,
      config: {...config, ...defaultReactionConfig()},
    };
    allMetadata.numberOfRegisteredReactionHandlers += 1;

    return allMetadata;
  });
};

export abstract class DynamicMessage {
  private isResponse: boolean = false;
  private responseTo: User = null;
  private metadata: IMetadata;
  private __message: Message = null;

  public set message(newMessage: Message) {
    if (this.__message !== null) {
      throw new Error(`DynamicMessage#message may not be reassigned once assigned!`);
    }
    this.__message =  newMessage;
    this.setupReactionCollector();
  }
  public get message() {
    return this.__message;
  }

  constructor() {
    this.metadata = Reflect.getMetadata(PROPERTY_METADATA_KEY, this) || initialMetadata();
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
    await awaitAllInOrder(Object.keys(this.metadata.reactionHandlers)
      .filter((emojiCode) => !this.metadata.reactionHandlers[emojiCode].config.hidden)
      .sort((a, b) =>
        this.metadata.reactionHandlers[a].registrationOrder - this.metadata.reactionHandlers[b].registrationOrder,
      )
      .map((emojiCode) => emojiUtils.get(emojiCode))
      .map((emoji) => this.message.react(emoji)));

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
