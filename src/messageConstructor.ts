import { SetupFunction as __SetupFunction } from './core/interfaces/SetupFunction';
import { Component } from './core/component';
import { MessageProxy } from './discord/MessageProxy';
import { TextChannel } from 'discord.js';
import { Transaction } from './core/interfaces/Transaction';
import { processTransaction } from './discord/processTransaction';

export type SetupFunction<T> = (props: T) => ReturnType<__SetupFunction>;

export const messageConstructor = <T extends object>(setup: SetupFunction<T>) => (props?: T) => {
  const message = new MessageProxy();
  const setupFunction = setup.bind(null, props);

  let isAttached = false;
  const transactionQueue: Transaction[] = [];
  const processTransactionQueue = () => {
    while (transactionQueue.length > 0) {
      const transaction = transactionQueue.shift();
      processTransaction(message, transaction);
    }
  }

  const component = new Component(setupFunction, (transaction) => {
    if (! isAttached) {
      transactionQueue.push(transaction);
      return;
    }
    processTransaction(message, transaction);
  });

  return {
    sendTo: (channel: TextChannel) => {
      message.sendToChannel(channel, component.cachedContent)
        .then(() => {
          isAttached = true;
          processTransactionQueue();
        });
    }
  };
};
