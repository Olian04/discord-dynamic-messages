import { IReactionConfig } from './IReactionConfig';
import { IReactionRemovedConfig } from './IReactionRemovedConfig';

export interface IMetadata {
  initHandler: {
    handlerKey: string;
  };
  numberOfRegisteredReactionHandlers: number;
  catchAllReactionHandler: {
    handlerKey: string;
    config: IReactionConfig;
  };
  catchAllReactionRemovedHandler: {
    handlerKey: string;
    config: IReactionRemovedConfig;
  };
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
