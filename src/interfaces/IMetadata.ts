import { IReactionConfig } from './IReactionConfig';

export interface IMetadata {
  numberOfRegisteredReactionHandlers: number;
  reactionHandlers: {
    [emoji: string]: {
      registrationOrder: number;
      handlerKey: string;
      config: IReactionConfig;
    };
  };
}
