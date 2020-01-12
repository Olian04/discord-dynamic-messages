import { ICatchAllConfig } from './ICatchAllConfig';
import { IReactionConfig } from './IReactionConfig';
import { IReactionRemovedConfig } from './IReactionRemovedConfig';

export interface IMetadata {
  initHandler: {
    handlerKey: string;
  };
  numberOfRegisteredReactionHandlers: number;
  catchAllReactionHandler: {
    handlerKey: string;
    config: ICatchAllConfig;
  };
  catchAllReactionRemovedHandler: {
    handlerKey: string;
    config: ICatchAllConfig;
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
