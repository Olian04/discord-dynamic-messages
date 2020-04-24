import { Effect } from './effects';

export interface SetupContext {
  __reRender: () => void,
  __isRunning: boolean,
  __pendingEffects: Effect[],
  __reactionHandlers: {
    [emojj: string]: {
      removed?: () => void;
      added?: () => void;
      hid?: () => void;
      shown?: () => void;
    }
  },
}