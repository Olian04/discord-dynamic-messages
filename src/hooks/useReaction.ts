import { getContext  } from '../core/util/contextHandler';

export const useReaction = (emoji) => {
  const ctx = getContext();
  return {
    show() {
      ctx.__pendingEffects.push({
        subject: 'reaction',
        operation: 'show',
        arguments: [ emoji ],
      });
    },
    hide() {
      ctx.__pendingEffects.push({
        subject: 'reaction',
        operation: 'hide',
        arguments: [ emoji ],
      });
    },
    on(event: keyof typeof ctx.__reactionHandlers[typeof emoji], handler) {
      if (! (emoji in ctx.__reactionHandlers)) {
        ctx.__reactionHandlers[emoji] = {};
      }
      ctx.__reactionHandlers[emoji][event] = handler;
    }
  }
}
