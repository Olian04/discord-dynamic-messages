import { DMChannel, GroupDMChannel, Message, MessageReaction, RichEmbed, TextChannel, User } from 'discord.js';
import emojiUtils from 'node-emoji';
import 'reflect-metadata';

interface IMetadata {
  reactionHandlers: {
    [emoji: string]: string;
  };
}

const PROPERTY_METADATA_KEY = Symbol('propertyMetadata');
const initialMetadata = (): IMetadata => ({
  reactionHandlers: {},
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

export const OnReaction = (emoji: string) => (target, propertyKey: string, descriptor: PropertyDescriptor) => {
  updateMetadata(target, (allMetadata) => {
    const handler = target[propertyKey].bind(target);

    // Add the reaction handler to the instance meta data
    allMetadata.reactionHandlers[emoji] = propertyKey;

    return allMetadata;
  });
};

export abstract class DynamicMessage {
  private isResponse: boolean = false;
  private responseTo: User = null;

  private metadata: IMetadata;
  private __message: Message;
  private set message(newMessage: Message) {
    this.__message =  newMessage;
    this.setupReactionCollector();
  }
  private get message() {
    return this.__message;
  }

  constructor() {
    this.metadata = Reflect.getMetadata(PROPERTY_METADATA_KEY, this) || initialMetadata();
  }

  public async sendTo(channel: TextChannel | DMChannel | GroupDMChannel) {
    this.message = (await channel.send(this.render())) as Message;
  }

  public async replyTo(msg: Message) {
    this.message = (await msg.reply(this.render())) as Message;
    this.isResponse = true;
    this.responseTo = msg.author;
  }

  protected abstract render(): string | RichEmbed;

  private setupReactionCollector = async () => {
    await Promise.all(Object.keys(this.metadata.reactionHandlers)
      .map((emojiCode) => emojiUtils.get(emojiCode))
      .map((emoji) => {
        return this.message.react(emoji); // TODO: This should be an option
      }));

    const collector = this.message.createReactionCollector(
      (reaction: MessageReaction) => emojiUtils.unemojify(reaction.emoji.name) in this.metadata.reactionHandlers,
    );

    collector.on('collect', (reaction: MessageReaction) => {
      const emojiCode = emojiUtils.unemojify(reaction.emoji.name);
      reaction.users
        .filter((user) => !user.bot) // TODO: This should be an option
        .forEach((user) => {
          const handlerKey = this.metadata.reactionHandlers[emojiCode];
          this[handlerKey](user, this.message.channel); // This should preserve the context of "this" within handler
          reaction.remove(user); // TODO: This should be an option
        });

      if (this.isResponse) {
        // TODO: Maybe this should be handled by the consumer?
        this.message.edit(`${this.responseTo} ${this.render()}`);
      } else {
        this.message.edit(this.render());
      }
    });
  }
}
