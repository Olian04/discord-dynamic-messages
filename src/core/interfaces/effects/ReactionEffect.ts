import { User } from 'discord.js';

export type ReactionEffect = {
  subject: 'reaction';
  operation: 'remove';
  arguments: [ User, string ];
} | {
  subject: 'reaction';
  operation: 'show';
  arguments: [ string ];
} | {
  subject: 'reaction';
  operation: 'hide';
  arguments: [ string ];
};