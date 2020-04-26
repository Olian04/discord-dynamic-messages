import { getContext } from '../core/util/contextHandler';

export const useChannel = () => {
  const ctx =  getContext();
  return ({
    ready() {
      return ctx.__knowledge.channel !== null;
    },
    get() {
      return ctx.__knowledge.channel;
    }
  });
}