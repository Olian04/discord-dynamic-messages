import { dynamicMessage, useReaction, useState } from '../src/api';

export const CounterMessage = dynamicMessage(() => {
  const state = useState({
    count:0,
  });

  const thumbsUp = useReaction(':thumbsup:');
  const thumbsDown = useReaction(':thumbsdown:');

  if (state.count >= 3) {
    thumbsUp.hide().off('added');
    thumbsDown.show().on('added', (user) => {
      state.count -= 1;
      thumbsDown.remove(user);
    });
  } else {
    thumbsDown.hide().off('added');
    thumbsUp.show().on('added', (user) => {
      state.count += 1;
      thumbsUp.remove(user);
    });
  }

   return `Count: ${state.count}`;
});