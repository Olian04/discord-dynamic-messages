import { SetupContext } from './interfaces/SetupContext';

export const createNewContext = (reRender: () => void): SetupContext => ({
  __reRender: reRender,
  __isUpdateSafe: false,
  __isDirty: true,
  __knowledge: {
    channel: null,
    guild: null,
  },
  __pendingEffects: [],
  __lifecycleHandlers: {},
  __reactionHandlers: {},
});