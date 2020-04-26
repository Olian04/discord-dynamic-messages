import { getContext } from '../core/util/contextHandler';

export const useGuild = () => {
  const ctx =  getContext();
  return ({
    ready() {
      return ctx.__knowledge.guild !== null;
    },
    get() {
      return ctx.__knowledge.guild;
    }
  });
}