import { dynamicMessage, useReaction, useState } from '../src/api';

export const EventMessage = dynamicMessage<{ title: string }>(({ title }) => {
  const state = useState({
    yes: [],
    no: [],
    maybe: [],
  });

  const thumbsUp = useReaction(':thumbsup:')
    .show()
    .on('added', (user) => {
      state.yes = [...state.yes, user.username];
      thumbsUp.remove(user);
    });

  const thumbsDown = useReaction(':thumbsdown:')
    .show()
    .on('added', (user) => {
      state.no = [...state.no, user.username];
      thumbsDown.remove(user);
    });

  const questionMark = useReaction(':grey_question:')
    .show()
    .on('added', (user) => {
      state.maybe = [...state.maybe, user.username];
      questionMark.remove(user);
    });

    const styledTitle = `**[event]** ${title}`;
    if (! (state.yes || state.no || state.maybe)) {
      return styledTitle;
    }

   return styledTitle +
    '\n```diff\n' +
    state.yes.map(name => `+ ${name}`).join('\n') +
    ((state.yes.length && state.no.length) ? '\n\n' : '' ) +
    state.no.map(name => `- ${name}`).join('\n') +
    ((state.no.length && state.maybe.length) ? '\n\n' : '' ) +
    state.maybe.map(name => `? ${name}`).join('\n') +
    '\n```';
});