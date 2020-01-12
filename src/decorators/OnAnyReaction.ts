import { ICatchAllConfig } from '../interfaces/ICatchAllConfig';
import { metadata } from '../manageMetadata';

const defaultReactionConfig = (): ICatchAllConfig => ({
  triggerRender: true,
  ignoreBots: true,
  ignoreHumans: false,
});

export const OnAnyReaction = (config: Partial<ICatchAllConfig> = {}) => (
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
