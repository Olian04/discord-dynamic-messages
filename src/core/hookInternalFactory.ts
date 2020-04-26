import { setContext } from './util/contextHandler';
import { createNewContext } from './context';
import { SetupContext } from './interfaces/SetupContext';
import { BuilderFunction } from './interfaces/BuilderFunction';
import { Effect } from './interfaces/effects';
import { User } from 'discord.js';
import { KnowledgeBase } from './interfaces/KnowledgeBase';

export const hookInternalFactory = (setupFunction: BuilderFunction, resolvePendingEffects: (effects: Effect[]) => void) => {
  let context: SetupContext;
  const runSetup = () => {
    setContext(context);
    context.__isUpdateSafe = true;
    const resultString = setupFunction();
    context.__isDirty = false;
    context.__isUpdateSafe = false;
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
    setKnowledge<K extends keyof KnowledgeBase>(key: K, value: KnowledgeBase[K]) {
      context.__knowledge[key] = value;
      runSetup();
    },
    handleLifecycleEvent(event: keyof typeof context.__lifecycleHandlers) {
      if (! (event in context.__lifecycleHandlers)) return;
      context.__lifecycleHandlers[event]();
    },
    handleReaction(user: User, event: keyof typeof context.__reactionHandlers[string], emoji: string) {
      if (! (emoji in context.__reactionHandlers)) return;
      if (! (event in context.__reactionHandlers[emoji])) return;

      context.__isUpdateSafe = true;
      context.__reactionHandlers[emoji][event](user);
      context.__isUpdateSafe = false;

      if (context.__isDirty || context.__pendingEffects.length > 0) {
        runSetup();
      }
    }
  });
};
