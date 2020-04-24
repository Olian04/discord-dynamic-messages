import { dynamicMessage, useReaction, useState } from '../src/api';
import { Client } from 'discord.js';

const HelloWorldMessage = dynamicMessage(() => {
  const state = useState({
    count:0,
  });

  const thumbsUp = useReaction(':thumbsup:');
  thumbsUp.show();

  thumbsUp.on('added', () => {
    state.count += 1;
  });

  thumbsUp.on('removed', () => {
    state.count -= 1;
  });

   return `Count: ${state.count}`;
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