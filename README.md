# discordjs-dynamic-messages

```ts
import { Client } from 'discord.js';
import { DynamicMessage, OnReaction } from 'discord-dynamic-message';

export class CounterMessage extends DynamicMessage {
  private counter;
  constructor(args) {
    super();
    this.counter = args.initialCounterValue;
  }

  @OnReaction(':thumbsup:')
  public increment(user, channel) {
    this.counter += 1;
  }

  @OnReaction(':thumbsdown:')
  public decrement(user, channel) {
    this.counter -= 1;
  }

  public render() {
    return `Counter: ${this.counter}`;
  }
}

const client = new Client();
client.on('ready', () => {
  client.on('message', (message) => {
    new CounterMessage({
      initialCounterValue: Number(args[0]),
    }).replyTo(message);
  });
});
client.login(discord_secret);
```

## Install

1. Install library: [`npm i discord-dynamic-messages`](https://www.npmjs.com/package/discord-dynamic-messages).
2. Enable `experimentalDecorators` and `emitDecoratorMetadata` in `tsconfig.json`.
3. Try the example above.

_Note: If you are using vscode you might need to set `javascript.implicitProjectConfig.experimentalDecorators` to `true` in the workspace settings._

## Development

1. Grab your discord-bot secret from the [discord developer portal](https://discordapp.com/developers/applications).
2. Create a `secrets.json` file and store your discord-bot secret as `discord_token` inside it.
3. Install dependencies: `npm i`.
4. Start demo: `npm run demo:start`.
