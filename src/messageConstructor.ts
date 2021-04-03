import { MessageEmbed } from "discord.js";
import { registerConstructor } from "./knownConstructors";
import { ConstructorIdentifier } from "./types/ConstructorIdentifier";

export const messageConstructor = (
  id: string,
  version: string,
  constructor: () => string | MessageEmbed
): ConstructorIdentifier => {
  const msgIdentifier: ConstructorIdentifier = {
    id,
    version,
  };
  registerConstructor(msgIdentifier, constructor);
  return msgIdentifier;
};
