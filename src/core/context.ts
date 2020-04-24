import { SetupContext } from './interfaces/SetupContext';

export const createNewContext = (reRender: () => void): SetupContext => ({
  __reRender: reRender,
  __isRunning: false,
  __pendingEffects: [],
  __reactionHandlers: {},
});