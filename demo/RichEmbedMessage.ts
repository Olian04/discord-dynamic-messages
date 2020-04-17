import { RichEmbed } from 'discord.js';
import { DynamicMessage, OnReaction } from '../old_src/api';

const first = () => new RichEmbed()
  .setAuthor('TOTO', 'https://i.imgur.com/ezC66kZ.png')
  .setColor('#AAA')
  .setTitle('First')
  .setDescription('First');

const second = () => new RichEmbed()
  .setAuthor('TOTO', 'https://i.imgur.com/ezC66kZ.png')
  .setColor('#548')
  .setTitle('Second')
  .setDescription('Second');

const third = () => new RichEmbed()
  .setAuthor('TOTO', 'https://i.imgur.com/ezC66kZ.png')
  .setColor('#35D')
  .setTitle('Third')
  .setDescription('Third');

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

export class RichEmbedMessage extends DynamicMessage {
  private embeds = [first, second, third];
  private embedIndex = 0;

  @OnReaction(':arrow_left:')
  public previousEmbed() {
    this.embedIndex = clamp(this.embedIndex - 1, 0, this.embeds.length - 1);
  }

  @OnReaction(':arrow_right:')
  public nextEmbed() {
    this.embedIndex = clamp(this.embedIndex + 1, 0, this.embeds.length - 1);
  }

  public render() {
    return this.embeds[this.embedIndex]()
      .setTimestamp()
      .setFooter(`Page ${this.embedIndex + 1}`);
  }
}
