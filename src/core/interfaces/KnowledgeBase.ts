import { Guild, TextChannel } from 'discord.js';

export interface KnowledgeBase {
  guild: Guild;
  channel: TextChannel;
}