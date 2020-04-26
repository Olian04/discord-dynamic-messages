import { dynamicMessage, onAttached, useState, useInterval } from '../src/api';

export const TickMessage = dynamicMessage(() => {
  const state = useState({
    count:0,
  });

  useInterval(1000, () => {
    state.count += 1;
  });

  onAttached(() => {
    console.log('Attached!');
  });

   return `${state.count % 2 === 0 ? 'Tick' : 'Tock'}: ${state.count}`;
});