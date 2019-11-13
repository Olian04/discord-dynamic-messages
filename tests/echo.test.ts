// tslint:disable
import { expect } from 'chai';
import { Message } from 'discord.js';
import { DynamicMessage } from '../src/api';
import { extractCommand } from './util/command';
import { describe, it } from './util/testCase';

export class EchoMessage extends DynamicMessage {
  constructor(private toEcho: string) {
    super();
  }

  public render() {
    return this.toEcho;
  }
}

export const testEcho = async (msg: Message) =>
  describe('EchoMessage', () => {
    it('should have content equal to command arguments', async () => {
      const [_, ...args] = extractCommand(msg.content);
      const echoMsg = await new EchoMessage(args.join(' ')).sendTo(msg.channel);
      expect(echoMsg.message.content).to.equal(args.join(' '));
    })
  })

