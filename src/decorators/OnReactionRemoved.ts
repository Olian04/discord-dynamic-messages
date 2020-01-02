import { IReactionRemovedConfig } from '../interfaces/IReactionRemovedConfig';
import { metadata } from '../manageMetadata';

const defaultReactionConfig = (): IReactionRemovedConfig => ({
  triggerRender: true,
  ignoreBots: true,
  ignoreHumans: false,
});

export const OnReactionRemoved = (emoji?: string, config: Partial<IReactionRemovedConfig> = {}) => (
  target: object,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  metadata.update(target, (allMetadata) => {
    if (emoji) {
      // Add the reaction handler to the instance meta data
      allMetadata.reactionRemovedHandlers[emoji] = {
        handlerKey: propertyKey,
        config: {...defaultReactionConfig(), ...config},
      };
    } else {
      // Add a catch all reaction handler
      allMetadata.catchAllReactionRemovedHandler = {
        handlerKey: propertyKey,
      };
    }

    return allMetadata;
  });
};
