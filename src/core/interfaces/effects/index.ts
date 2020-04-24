import { ReactionEffect } from './ReactionEffect';
import { ContentEffect } from './ContentEffect';

export type Effect = ReactionEffect | ContentEffect;

export type Subjects = Effect['subject'];
export type Operations<Subject extends Subjects> =
  Subject extends 'reaction' ? ReactionEffect['operation'] :
  Subject extends 'content' ? ContentEffect['operation'] :
  never;

export type Arguments<Subject extends Subjects> =
  Subject extends 'reaction' ? ReactionEffect['arguments'] :
  Subject extends 'content' ? ContentEffect['arguments'] :
  never;