import { Snowflake } from "discord.js";
import { ConstructorIdentifier } from "./ConstructorIdentifier";

export interface DatabaseAdapter {
  getConstructorIdentifier: (identifier: Snowflake) => ConstructorIdentifier;
  setConstructorIdentifier: (
    identifier: Snowflake,
    constructorIdentifier: ConstructorIdentifier
  ) => void;
  hasState: (identifier: Snowflake, key: string) => boolean;
  getState: (identifier: Snowflake, key: string) => unknown;
  setState: (identifier: Snowflake, key: string, value: unknown) => void;
}
