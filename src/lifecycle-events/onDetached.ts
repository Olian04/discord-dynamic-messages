import { getContext } from '../core/util/contextHandler';

export const onDetached = (handler: () => void) => {
  const ctx = getContext();
  ctx.__lifecycleHandlers.onDetached = handler;
}
