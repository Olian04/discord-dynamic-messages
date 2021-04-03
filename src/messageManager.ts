import { TextChannel } from "discord.js";
import { runConstructor } from "./runConstructor";
import * as context from "./constructorContextManager";
import { Config } from "./types/Config";
import { ConstructorIdentifier } from "./types/ConstructorIdentifier";

export const messageManager = (config: Config) => {
  const api = {
    sendTo: async (
      discordTextChannel: TextChannel,
      messageIdentifier: ConstructorIdentifier
    ) => {
      const message = await discordTextChannel.send("Loading...");

      context.setLifecycleStep("attaching");

      runConstructor(config, messageIdentifier, message);
    },
  };
  return api;
};
