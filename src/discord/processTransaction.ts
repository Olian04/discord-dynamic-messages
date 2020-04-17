import { MessageProxy } from './MessageProxy';
import { Transaction, Subjects, Operations, Arguments } from '../core/interfaces/Transaction';
import { resolveEmoji } from './resolveEmoji';

export const processTransaction = (message: MessageProxy, transaction: Transaction) => {
  type ResolverObject = {
    [subject in Subjects]: {
      [operation in Operations<subject>]: (...args: Arguments<subject>) => void;
    }
  };
  const resolvers: ResolverObject = {
    content: {
      update: (newContent) => {
        // TODO: Implement me
      },
    },
    reaction: {
      add: (emojiCode) => {
        const emoji = resolveEmoji(emojiCode);
        console.log(emojiCode, emoji);
        message.addReaction(emoji);
      },
      remove: (emoji) => {
        // TODO: Implement me
      },
    },
  };
  resolvers[transaction.subject][transaction.operation](...transaction.arguments);
};