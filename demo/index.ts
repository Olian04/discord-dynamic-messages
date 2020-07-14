import { Client, Message } from 'discord.js';
import { emoji } from 'node-emoji';
import * as path from 'path';
import { AccumulatorMessage } from './AccumulatorMessage';
import { AttachMessage } from './AttachMessage';
import { CounterMessage } from './CounterMessage';
import { EchoMessage } from './EchoMessage';
import { NumericEmojiMessage } from './NumericEmojiMessage';
import { MessageEmbedMessage } from './MessageEmbedMessage';
import { ToggleMessage } from './ToggleMessage';

// tslint:disable-next-line no-var-requires
const secrets = require(path.resolve(__dirname, '..', 'secrets.json'));

const client = new Client();

client.on('ready', async ()  => {
  // tslint:disable-next-line:no-console
  console.info(`Client ready`);

  const attachMessage = new AttachMessage();

  client.on('message', async (message) => {
    if (! message.content.startsWith('$')) { return; }
    const [command, ...args] = message.content.substr(1).split(' ');

    if (command === 'help') {
      message.reply(`
        Available commands are:
        - help
        - count [startCount]
        - echo <msg>
        - acc
        - num
        - toggle
        - attach
        - retro
        - rich
      `);
    } else if (command === 'count') {
      new CounterMessage({
        initialCounterValue: Number(args[0] || '0'),
      }).sendTo(message.channel);
    } else if (command === 'echo') {
      new EchoMessage(args.join(' ')).replyTo(message);
    } else if (command === 'acc') {
      new AccumulatorMessage().sendTo(message.channel);
    } else if (command === 'num') {
      new NumericEmojiMessage().sendTo(message.channel);
    } else if (command === 'toggle') {
      new ToggleMessage().sendTo(message.channel);
    } else if (command === 'attach') {
      const dummyMsg = await message.channel.send('dummy message') as Message;
      attachMessage.attachTo(dummyMsg);
    } else if (command === 'retro') {
      const dummyMsg = await message.channel.send('taken over in 3 seconds') as Message;
      dummyMsg.react(emoji.thumbsup).then(() => {
        setTimeout(() => {
          new CounterMessage({
            initialCounterValue: 0,
          }).attachTo(dummyMsg);
        }, 3000);
      });
    } else if (command === 'rich') {
      new MessageEmbedMessage().sendTo(message.channel);
    }
  });
});

client.login(secrets.discord_token)
  .then(() => {
    // tslint:disable-next-line:no-console
    console.info(`Login successful`);
  })
  .catch((err) => {
    // tslint:disable-next-line:no-console
    console.error(`Login failed`);
    throw err;
  });
