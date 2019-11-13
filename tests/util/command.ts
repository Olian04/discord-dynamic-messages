
export const isCommand =  (content: string) => content.startsWith('$');

export const extractCommand =  (content: string) => {
  const [command, ...args] = content.substr(1).split(' ');
  return [command, args];
};