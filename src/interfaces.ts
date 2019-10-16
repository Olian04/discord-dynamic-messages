export interface IReactionConfig {
  hidden: boolean;
  triggerRender: boolean;
  removeWhenDone: boolean;
  ignoreBots: boolean;
  ignoreHumans: boolean;
}

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
interface IDynamicMessageConfigTame {
  volatile: false;
  onError: (error: Error) => void;
}
interface IDynamicMessageConfigVolatile {
  volatile: true;
  onError?: (error: Error) => void;
}
export type IDynamicMessageConfig = IDynamicMessageConfigVolatile | IDynamicMessageConfigTame;
