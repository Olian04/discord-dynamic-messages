import { Message } from "discord.js";
import { DatabaseAdapter } from "./types/DatabaseAdapter";

const context: {
  databaseAdapter: DatabaseAdapter;
  discordMessage: Message;
  lifecycleStep: "attaching" | "active" | "detaching";
} = {
  databaseAdapter: null,
  discordMessage: null,
  lifecycleStep: "active",
};

export const resetContext = () => {
  context.databaseAdapter = null;
  context.discordMessage = null;
  context.lifecycleStep = "active";
};

export const setLifecycleStep = (step: typeof context.lifecycleStep) => {
  context.lifecycleStep = step;
};

export const setMessage = (message: Message) => {
  context.discordMessage = message;
};

export const getMessage = () => context.discordMessage;
export const getGuild = () => context.discordMessage.guild;
export const getChannel = () => context.discordMessage.channel;
export const getClient = () => context.discordMessage.client;

export const setDatabaseAdapter = (adapter: DatabaseAdapter) => {
  context.databaseAdapter = adapter;
};

export const setState = (id: string, value: unknown) => {
  context.databaseAdapter.setState(context.discordMessage.id, id, value);
};
export const getState = <T>(id: string) => {
  return context.databaseAdapter.getState(context.discordMessage.id, id) as T;
};
