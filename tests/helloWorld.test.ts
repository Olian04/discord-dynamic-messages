import { dynamicMessage, useReaction } from '../src/api';
import { Client } from 'discord.js';

const HelloWorldMessage = dynamicMessage(() => {
  const reaction = useReaction(':thumbsup:');
  reaction.show();

   return `Hello World`;
});

const client = new Client();
client.on('ready', () => {
  client.on('message', (message) => {
    if (! message.content.startsWith('!test')) { return; }
    if (message.channel.type === 'text') {
      HelloWorldMessage().sendTo(message.channel);
    }
  });
});

(async () => {
  const { discord_token } = await import('../secrets.json');
  await client.login(discord_token);
})();