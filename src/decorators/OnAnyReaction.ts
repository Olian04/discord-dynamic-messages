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

export const OnAnyReaction = (config: Partial<IReactionConfig> = {}) => (
  target: object,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  metadata.update(target, (allMetadata) => {
    // Add a catch all reaction handler
    allMetadata.catchAllReactionHandler = {
      handlerKey: propertyKey,
      config: {...defaultReactionConfig(), ...config},
    };
    return allMetadata;
  });
};
