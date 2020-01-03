import { IReactionRemovedConfig } from '../interfaces/IReactionRemovedConfig';
import { metadata } from '../manageMetadata';

const defaultReactionConfig = (): IReactionRemovedConfig => ({
  triggerRender: true,
  ignoreBots: true,
  ignoreHumans: false,
});

export const OnAnyReactionRemoved = (config: Partial<IReactionRemovedConfig> = {}) => (
  target: object,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  metadata.update(target, (allMetadata) => {
    // Add a catch all reaction handler
    allMetadata.catchAllReactionRemovedHandler = {
      handlerKey: propertyKey,
      config: {...defaultReactionConfig(), ...config},
    };
    return allMetadata;
  });
};
