import { SetupContext } from '../interfaces/SetupContext';

const contextHandlerFactory = <Context>() => {
  let currentContext: Context;
  return ({
    setContext: (newContext: Context) => {
      currentContext = newContext;
    },
    getContext: (): Context => currentContext,
  });
};

const ContextHandler = contextHandlerFactory<SetupContext>();

export const getContext = ContextHandler.getContext;
export const setContext = ContextHandler.setContext;
