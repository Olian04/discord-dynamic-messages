import { MessageProxy } from './MessageProxy';
import { Effect, Subjects, Operations, Arguments } from '../core/interfaces/effects';
import { resolveEmoji } from './util/resolveEmoji';

type ResolverObject = {
  [subject in Subjects]: {
    [operation in Operations<subject>]: (...args: Arguments<subject>) => void;
  }
};

const constructResolverObject = (message: MessageProxy): ResolverObject => ({
  content: {
    update: (newContent) => {
      if (typeof newContent === 'string') {
        message.updateContents(newContent, null);
      } else {
        message.updateContents('', newContent);
      }
    },
  },
  reaction: {
    show: (...args) => {
      if (typeof args[0] !== 'string') throw new Error(`Reaction#show expected argument list [string] but got [${typeof args[0]}]`);
      const emojiCode: string = args[0];
      const emoji = resolveEmoji(emojiCode);
      message.showReaction(emoji);
    },
    hide: (...args) => {
      if (typeof args[0] !== 'string') throw new Error(`Reaction#show expected argument list [string] but got [${typeof args[0]}]`);
      const emojiCode: string = args[0];
      const emoji = resolveEmoji(emojiCode);
      message.hideReaction(emoji);
    },
    remove: (...args) => {
      // TODO: Implement me
    },
  },
});

export const processEffect = (message: MessageProxy, effect: Effect) => {
  const resolvers = constructResolverObject(message);
  resolvers[effect.subject][effect.operation](...effect.arguments);
};