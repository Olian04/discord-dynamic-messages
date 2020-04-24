# discord-dynamic-messages

__IMPORTANT NOTICE:__ This is the development branch for the hooks API, and its in a very early stage of development.

__DO NOT USE THIS BRANCH IN PRODUCTION!__

## API (So far)

### Hello world

```ts
import { dynamicMessage } from 'discord-dynamic-messages';

const HelloWorld = dynamicMessage(() => {
  return 'Hello World';
});

const client = new Client();
client.on('ready', () => {
  client.on('message', (message) => {
    if (message.channel.type === 'text') {
      HelloWorld().sendTo(message.channel);
    }
  });
});

(async () => {
  const { discord_token } = await import('../secrets.json');
  await client.login(discord_token);
})();
```

### useReaction

```ts
import { dynamicMessage, useReaction } from '../src/api';
const LoggerMessage = dynamicMessage(() => {
  const thumbsUp = useReaction(':thumbsup:');
  thumbsUp.show();

  thumbsUp.on('added', () => {
    console.log(':)');
  });

  thumbsUp.on('removed', () => {
    console.log(':(');
  });

   return `Logger`;
});

const client = new Client();
client.on('ready', () => {
  client.on('message', (message) => {
    if (! message.content.startsWith('!test')) { return; }
    if (message.channel.type === 'text') {
      LoggerMessage().sendTo(message.channel);
    }
  });
});

(async () => {
  const { discord_token } = await import('../secrets.json');
  await client.login(discord_token);
})();
```

### useState

```ts
import { dynamicMessage, useState } from '../src/api';
const CountingMessage = dynamicMessage(() => {
  const state = useState({
    count: 0,
  });

  setTimeout(()  => {
    state.count += 1;
  }, 1000);

   return `Counting up every second: ${state.count}`;
});

const client = new Client();
client.on('ready', () => {
  client.on('message', (message) => {
    if (! message.content.startsWith('!test')) { return; }
    if (message.channel.type === 'text') {
      CountingMessage().sendTo(message.channel);
    }
  });
});

(async () => {
  const { discord_token } = await import('../secrets.json');
  await client.login(discord_token);
})();
```
