import { getContext  } from '../core/contextHandler';

const internalState = new WeakMap();

// Pseudo code for the useReaction logic
export const useReaction = (emoji) => {
   const ctx = getContext();
   if (!internalState.has(ctx)) {
     internalState.set(ctx, {
       visible: false,
     });
   }
   const state = internalState.get(ctx);
   const api = {
     show: () => {
        if (state.visible) {
          // Already visible
          return;
        }
        internalState.set(ctx, {
          ...state,
          visible: true,
        });
        ctx.commitTransaction({
           subject: 'reaction',
           operation: 'add',
           arguments: [ emoji ]
        });
     },
     hide: () => {
      if (!state.visible) {
        // Already hidden
        return;
      }
      internalState.set(ctx, {
        ...state,
        visible: false,
      });
      ctx.commitTransaction({
         subject: 'reaction',
         operation: 'remove',
         arguments: [ emoji ]
      });
     }
   };
   return api;
}