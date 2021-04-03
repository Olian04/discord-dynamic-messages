# discord-dynamic-messages

__IMPORTANT NOTICE:__ This is the development branch for the hooks API, and its in a very early stage of development.

__DO NOT USE THIS BRANCH IN PRODUCTION!__

```ts
import { dynamicMessage, dynamicMessageManager } from 'discord-dynamic-messages';

const counterMessage = dynamicMessage('counter', 'v1', () => {
   const [count, setCount] = useState('count', 0);
   const {onAdded, onRemoved, addSelf, removeSelf} = useReaction(':thumbsup:');
   const {onAdded: onCrossEmoji} = useReaction(':redcross:');
   const {detach} = useSelf();

   onCrossEmoji(() => {
       detach();
   });

   onAttached(() => {
      addSelf();
   });

  onDetached(() => {
      removeSelf();
   });
   
   onAdded(() => setCount(c => c+1));
   onRemoved(() => setCount(c => c-1));

   return `Count: ${count}`;
});

const dmm = new DynamicMessageManager({
  db: new FirebaseDBManager(firebaseConfig),
});

const client = new Client();
client.on('message', async (message) => {
  if (message.channel.type !== 'text') return;
  if (message.content !== '!count') return;

  dmm.sendTo(message.channel, counterMessage);
});

(async () => {

  const { discord_token } = await import('../secrets.json');
  await client.login(discord_token);
})();
```

## API (So far)

Statefull hooks:
useState
useReaction

Reflective-state hooks:
useGuild
useChannel
useMessage
useClient
useSelf

Lifecycle hooks:
onAttached
onDetached

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
```

### useChannel

```ts
import { dynamicMessage, useChannel  } from '../src/api';

export const InfoMessage = dynamicMessage(() => {
  const channel = useChannel();
  return `Channel: ${channel.get()?.name}`;
});
```

### useGuild

```ts
import { dynamicMessage, useGuild  } from '../src/api';

export const InfoMessage = dynamicMessage(() => {
  const guild = useGuild();
  return `Guild: ${guild.get()?.name}`;
});
```

### useInterval

```ts
import { dynamicMessage, useState, useInterval } from '../src/api';

export const TickMessage = dynamicMessage(() => {
  const state = useState({
    count:0,
  });

  useInterval(3000, () => {
    state.count += 1;
  });

   return `${state.count % 2 === 0 ? 'Tick' : 'Tock'}: ${state.count}`;
});
```

### onAttached & onDetached

```ts
import { dynamicMessage, onAttached, onDetached } from '../src/api';

export const TickMessage = dynamicMessage(() => {
  onAttached(() => {
    console.log('Attached!');
  });
  onDetached(() => {
    console.log('Detached!');
  });

  return 'Life cycle events';
});
```
