import { Message } from "discord.js";
import * as context from "./constructorContextManager";
import { findConstructor } from "./knownConstructors";
import { Config } from "./types/Config";
import { ConstructorIdentifier } from "./types/ConstructorIdentifier";

export const runConstructor = (
  config: Config,
  messageIdentifier: ConstructorIdentifier,
  discordMessage: Message
) => {
  const constructor = findConstructor(messageIdentifier);

  if (constructor === null) {
    console.warn(
      `Failed to construct dynamic message due to unknown id or version ${messageIdentifier.id}/${messageIdentifier.version}`
    );
    return;
  }

  context.setMessage(discordMessage);
  context.setDatabaseAdapter(config.db);

  const newMsgBody = constructor();

  context.resetContext();

  discordMessage.edit(newMsgBody);
};
