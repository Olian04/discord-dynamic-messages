import { Component } from './component';

const contextHandlerFactory = () => {
  let currentContext: Component;
  return ({
    setContext: (newContext: Component) => {
      currentContext = newContext;
    },
    getContext: (): Component => currentContext,
  });
};

const ContextHandler = contextHandlerFactory();

export const getContext = ContextHandler.getContext;
export const setContext = ContextHandler.setContext;
