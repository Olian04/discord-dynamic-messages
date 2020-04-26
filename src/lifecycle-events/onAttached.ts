import { getContext } from '../core/util/contextHandler';

export const onAttached = (handler: () => void) => {
  const ctx = getContext();
  ctx.__lifecycleHandlers.onAttached = handler;
}
