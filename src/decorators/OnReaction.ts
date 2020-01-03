import { IReactionConfig } from '../interfaces/IReactionConfig';
import { metadata } from '../manageMetadata';

const defaultReactionConfig = (): IReactionConfig => ({
  hidden: false,
  triggerRender: true,
  removeWhenDone: true,
  ignoreBots: true,
  ignoreHumans: false,
  doRetroactiveCallback: true,
});

export const OnReaction = (emoji: string, config: Partial<IReactionConfig> = {}) => (
  target: object,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  metadata.update(target, (allMetadata) => {
    // Add the reaction handler to the instance meta data
    allMetadata.reactionHandlers[emoji] = {
      registrationOrder: allMetadata.numberOfRegisteredReactionHandlers,
      handlerKey: propertyKey,
      config: {...defaultReactionConfig(), ...config},
    };
    allMetadata.numberOfRegisteredReactionHandlers += 1;

    return allMetadata;
  });
};
