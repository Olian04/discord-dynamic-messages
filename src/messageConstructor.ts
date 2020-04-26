import { TextChannel, PartialUser } from 'discord.js';
import { hookInternalFactory } from './core/hookInternalFactory';
import { BuilderFunction } from './core/interfaces/BuilderFunction';
import { MessageProxy } from './discord/MessageProxy';
import { processEffect } from './discord/processEffect';
import { Effect } from './core/interfaces/effects';
import { resolveEmojiName } from './discord/util/resolveEmoji';

type SetupFunction<T> = (options: T) => ReturnType<BuilderFunction>;
export type MessageAPI = ReturnType<ReturnType<typeof messageConstructor>>;

export const messageConstructor = <T>(setup: SetupFunction<T>) => (options?: T) => {
  const message = new MessageProxy();

  let isMessageAttached = false;
  let pendingEffects: Effect[] = [];
  const internals = hookInternalFactory(() => setup(options), (effects) => {
    if (!isMessageAttached) {
      pendingEffects.push(...effects);
      return;
    }
    processEffects(effects);
  });

  const processEffects = (effects: Effect[]) => {
    effects.forEach(effect => {
      console.log(effect.subject, effect.operation);
      processEffect(message, effect);
    });
  }

  message.onMessageAttached(() => {
    internals.handleLifecycleEvent('onAttached');
  });
  message.onMessageDetached(() => {
    internals.handleLifecycleEvent('onDetached');
  });

  message.onReactionAdded((reaction, user) => {
    if (user.bot) {
      internals.handleReaction(user, 'shown', resolveEmojiName(reaction.emoji.name));
    } else {
      internals.handleReaction(user, 'added', resolveEmojiName(reaction.emoji.name));
    }
  });

  message.onReactionRemoved((reaction, user) => {
    if (user.bot) {
      internals.handleReaction(user, 'hid', resolveEmojiName(reaction.emoji.name));
    } else {
      internals.handleReaction(user, 'removed', resolveEmojiName(reaction.emoji.name));
    }
  });

  return {
    detach: () => {
      message.detachMessage();
      internals.setKnowledge('guild', null);
      internals.setKnowledge('channel', null);
      internals.handleLifecycleEvent('onDetached');
    },
    sendTo: (channel: TextChannel, placeholderMessage?: string) => {
      message.sendToChannel(channel, placeholderMessage ?? 'Loading...')
        .then(() => {
          isMessageAttached = true;
          processEffects(pendingEffects);
          pendingEffects = [];
          internals.setKnowledge('guild', message.guild);
          internals.setKnowledge('channel', message.channel as TextChannel);
          internals.handleLifecycleEvent('onAttached');
        });
    }
  };
};
