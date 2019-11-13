// tslint:disable
import { expect } from 'chai';
import { Message } from 'discord.js';
import { emoji } from 'node-emoji';
import { DynamicMessage, OnReaction } from '../src/api';
import { extractCommand } from './util/command';
import { describe, it } from './util/testCase';

export class AccumulatorMessage extends DynamicMessage {
  private accumulator: string = '';
  constructor() {
    super();
  }

  @OnReaction(':thumbsup:')
  public up() {
    this.accumulator += emoji['+1'];
  }

  @OnReaction(':thumbsdown:')
  public down() {
    this.accumulator += emoji['-1'];
  }

  @OnReaction(':wrench:', {
    hidden: true,
  })
  public hidden_wrench() {
    this.accumulator += emoji.wrench;
  }

  @OnReaction(':angel:')
  public angle() {
    this.accumulator += emoji.angel;
  }

  @OnReaction(':alien:')
  public alien() {
    this.accumulator += emoji.alien;
  }

  public render() {
    return `Accumulator: ${this.accumulator}`;
  }
}

export const testAccumulator = async (msg: Message) =>
  describe('EchoMessage', () => {
    it('should have content equal to reactions', async () => {
      const [_, ...args] = extractCommand(msg.content);
      const echoMsg = await new AccumulatorMessage().sendTo(msg.channel);
      const reactions = (await echoMsg.message.awaitReactions(r => true, {
        maxEmojis: 3,
        time: 100000,
      })).array();

      const output = reactions.map(r => r.emoji.name).join('');
      expect('Accumulator: ' + echoMsg.message.content).to.equal(output);
    });
  });
