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

      ctx.__isDirty = true; // Notifies the system that a reRender is needed
      if (ctx.__isUpdateSafe) {
        // Helps prevent infinite recursion
        return true;
      }
      ctx.__reRender(); // Only brute force a reRender if not currently in a updateSafe context
      // example of unsafe update context: setTimeout, setInterval, process.on, fetch, database requests, etc...
      return true;
    }
  }));

  return stateMap.get(ctx);
};
