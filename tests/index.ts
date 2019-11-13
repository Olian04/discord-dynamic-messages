import { Client, Message } from 'discord.js';
import * as path from 'path';
import { testAccumulator } from './accumulators.test';
import { testEcho } from './echo.test';
import { extractCommand, isCommand } from './util/command';

// tslint:disable-next-line no-var-requires
const secrets = require(path.resolve(__dirname, '..', 'secrets.json'));

const client = new Client();

client.on('ready', () => {
  client.on('message', (message: Message) => {
    if (! isCommand(message.content)) { return; }
    const [command, ...args] = extractCommand(message.content);

    switch (command) {
      case 'echo':
        testEcho(message);
        return;
      case 'acc':
        testAccumulator(message);
        return;
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
