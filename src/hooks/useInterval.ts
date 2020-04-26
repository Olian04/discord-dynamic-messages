import { getContext  } from '../core/util/contextHandler';
import { SetupContext } from '../core/interfaces/SetupContext';

const cache = new WeakMap<SetupContext, NodeJS.Timeout>();
export const useInterval= (time: number, handler: () => void) => {
  const ctx = getContext();

  if (cache.has(ctx)) return;

  const startTimer = () => {
    cache.set(ctx, setTimeout(() => {
        ctx.__isUpdateSafe = true;
        handler();
        ctx.__isUpdateSafe = false;

        if (ctx.__isDirty || ctx.__pendingEffects.length > 0) {
          ctx.__reRender();
        }
        startTimer();
      }, time),
    );
  };

  startTimer();
}
