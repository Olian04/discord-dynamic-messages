import { getContext  } from '../core/util/contextHandler';
import { User } from 'discord.js';

type API = ReturnType<typeof useReaction>;

const cache = new WeakMap();
export const useReaction = (emoji) => {
  const ctx = getContext();
  if (! cache.has(ctx)) {
    cache.set(ctx, {
      [emoji]: false,
    });
  }
  const setCachedValue = (showed: boolean) => {
    cache.set(ctx, {
      ...cache.get(ctx),
      [emoji]: showed,
    });
  };
  const getCachedValue = (): boolean =>
    cache.get(ctx)[emoji];

  return {
    show() {
      if (getCachedValue() === true) return this as API;
      setCachedValue(true);
      ctx.__pendingEffects.push({
        subject: 'reaction',
        operation: 'show',
        arguments: [ emoji ],
      });
      return this as API;
    },
    hide() {
      if (getCachedValue() === false) return this as API;
      setCachedValue(false);
      ctx.__pendingEffects.push({
        subject: 'reaction',
        operation: 'hide',
        arguments: [ emoji ],
      });
      return this as API;
    },
    on(event: keyof typeof ctx.__reactionHandlers[typeof emoji], handler: (user: User) => void) {
      if (! (emoji in ctx.__reactionHandlers)) {
        ctx.__reactionHandlers[emoji] = {};
      }
      ctx.__reactionHandlers[emoji][event] = handler;
      return this as API;
    },
    off(event: keyof typeof ctx.__reactionHandlers[typeof emoji]) {
      if (! (emoji in ctx.__reactionHandlers)) return this as API;
      if (! (event in ctx.__reactionHandlers[emoji])) return this as API;
      delete ctx.__reactionHandlers[emoji][event];
      return this as API;
    },
    remove(user: User) {
      ctx.__pendingEffects.push({
        subject: 'reaction',
        operation: 'remove',
        arguments: [ user, emoji ],
      });
      return this as API;
    }
  }
}
