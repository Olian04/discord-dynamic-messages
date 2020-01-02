import { IReactionConfig } from './IReactionConfig';
import { IReactionRemovedConfig } from './IReactionRemovedConfig';

export interface IMetadata {
  numberOfRegisteredReactionHandlers: number;
  reactionHandlers: {
    [emoji: string]: {
      registrationOrder: number;
      handlerKey: string;
      config: IReactionConfig;
    };
  };
  reactionRemovedHandlers: {
    [emoji: string]: {
      handlerKey: string;
      config: IReactionRemovedConfig;
    };
  };
}
