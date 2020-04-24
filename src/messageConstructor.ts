import { TextChannel } from 'discord.js';
import { hookInternalFactory } from './core/hookInternalFactory';
import { BuilderFunction } from './core/interfaces/BuilderFunction';
import { MessageProxy } from './discord/MessageProxy';
import { processEffect } from './discord/processEffect';
import { Effect } from './core/interfaces/effects';
import { resolveEmojiName } from './discord/util/resolveEmoji';

type SetupFunction<T> = (options: T) => ReturnType<BuilderFunction>;

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
      processEffect(message, effect);
    });
  }

  message.onReactionAdded((reaction, user) => {
    if (user.bot) {
      internals.handleReaction('shown', resolveEmojiName(reaction.emoji.name));
    } else {
      internals.handleReaction('added', resolveEmojiName(reaction.emoji.name));
    }
  });

  message.onReactionRemoved((reaction, user) => {
    if (user.bot) {
      internals.handleReaction('hid', resolveEmojiName(reaction.emoji.name));
    } else {
      internals.handleReaction('removed', resolveEmojiName(reaction.emoji.name));
    }
  });

  return {
    sendTo: (channel: TextChannel, placeholderMessage?: string) => {
      message.sendToChannel(channel, placeholderMessage ?? 'Loading...')
        .then(() => {
          isMessageAttached = true;
          processEffects(pendingEffects);
          pendingEffects = [];
        });
    }
  };
};
