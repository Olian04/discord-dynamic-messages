# discordjs-dynamic-messages

```ts
import { Client } from 'discord.js';
import {
  DynamicMessage,
  OnReaction,
} from 'discordjs-decorators';

class CounterMessage extends DynamicMessage {
  private counter;
  constructor(args) {
    super();
    this.counter = args.initalCounterValue;
  }

  @OnReaction(':thumbsup:', {
    removedWhenDone: true, // default
    triggersRender: true, // default
    includeBots: false, // default
  })
  increment(user, channel, reactions) {
    this.counter += 1;
  }
  
  @OnReaction(':thumbsdown:')
  increment(user, channel, reactions) {
    this.counter -= 1;
  }
  
  render() {
    return {
      content: `Counter: ${this.counter}`,
    };
  }
}

const client = new Client();
client.on('ready', async () => {
  client.on('message', async (message) => {
    CounterMessage.replyTo(message, {
      initialCounterValue: 0,
    });
  })
})
client.login(discord_secret);
```
