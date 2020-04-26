import { Client } from 'discord.js';
import { CounterMessage } from './counter.test';
import { EventMessage } from './event.test';
import { TickMessage } from './tick.test';
import { MessageAPI } from '../src/messageConstructor';
import { InfoMessage } from './info.test';

const commandMap: { [k: string]:  (str) => MessageAPI} = {
  event: (str) => EventMessage({ title: str }),
  count: () => CounterMessage(),
  tick: () => TickMessage(),
  info: () => InfoMessage(),
};
const client = new Client();
client.on('ready', () => {
  client.on('message', (message) => {
    if (message.channel.type !== 'text') return;
    const command = Object.keys(commandMap).find(c => message.content.startsWith(`!${c}`));
    if (command === undefined) {
      console.warn('[meta] Unknown command', command);
      return;
    }
    const str = message.content.substr(command.length);
    commandMap[command](str).sendTo(message.channel);
  });
});

(async () => {
  const { discord_token } = await import('../secrets.json');
  await client.login(discord_token);
})();