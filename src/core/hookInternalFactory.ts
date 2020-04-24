import { setContext } from './util/contextHandler';
import { createNewContext } from './context';
import { SetupContext } from './interfaces/SetupContext';
import { BuilderFunction } from './interfaces/BuilderFunction';
import { Effect } from './interfaces/effects';

export const hookInternalFactory = (setupFunction: BuilderFunction, resolvePendingEffects: (effects: Effect[]) => void) => {
  let context: SetupContext;
  const runSetup = () => {
    setContext(context);
    context.__isRunning = true;
    const resultString = setupFunction();
    context.__isRunning = false;
    context.__pendingEffects.push({
      subject: 'content',
      operation: 'update',
      arguments: [ resultString ],
    });
    resolvePendingEffects(context.__pendingEffects);
    context.__pendingEffects = []; // Reset context for next time step.
  };

  context = createNewContext(runSetup);
  runSetup();

  return ({
    handleReaction(event: keyof typeof context.__reactionHandlers[string], emoji: string) {
      if (! (emoji in context.__reactionHandlers)) return;
      if (! (event in context.__reactionHandlers[emoji])) return;
      context.__reactionHandlers[emoji][event]();
    }
  });
};
