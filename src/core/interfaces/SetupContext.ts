import { Effect } from './effects';
import { User } from 'discord.js';
import { KnowledgeBase } from './KnowledgeBase';

export interface SetupContext {
  __reRender: () => void;
  __isUpdateSafe: boolean;
  __isDirty: boolean;
  __knowledge: KnowledgeBase;
  __pendingEffects: Effect[];
  __lifecycleHandlers: {
    onAttached?: () => void;
    onDetached?: () => void;
  },
  __reactionHandlers: {
    [emojj: string]: {
      removed?: (user: User) => void;
      added?: (user: User) => void;
      hid?: (user: User) => void;
      shown?: (user: User) => void;
    }
  };
}