import emojiUtils from 'node-emoji';

const emojiFixes = {
  ':zero:': '\u0030\u20E3',
  ':one:': '\u0031\u20E3',
  ':two:': '\u0032\u20E3',
  ':three:': '\u0033\u20E3',
  ':four:': '\u0034\u20E3',
  ':five:': '\u0035\u20E3',
  ':six:': '\u0036\u20E3',
  ':seven:': '\u0037\u20E3',
  ':eight:': '\u0038\u20E3',
  ':nine:': '\u0039\u20E3',
};

export const resolveEmoji = (emojiCode: string): string => {
  if (emojiCode in emojiFixes) {
    return emojiFixes[emojiCode];
  }
  return emojiUtils.get(emojiCode);
}

export const resolveEmojiName = (emoji: string): string => {
  return emojiUtils.unemojify(emoji);
}