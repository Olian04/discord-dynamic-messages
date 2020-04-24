import { getContext  } from '../core/util/contextHandler';

const stateMap = new WeakMap();
export const useState = <T extends object>(data: T): T => {
  const ctx = getContext();

  if (stateMap.has(ctx)) {
    return stateMap.get(ctx);
  }

  stateMap.set(ctx, new Proxy(data, {
    set(__, key, value) {
      __[key] = value;
      if (ctx.__isRunning) {
        // Helps prevent infinite reccursion
        return true;
      }
      ctx.__reRender();
      return true;
    }
  }));

  return stateMap.get(ctx);
};
