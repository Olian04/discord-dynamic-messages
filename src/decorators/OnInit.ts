import { IReactionConfig } from '../interfaces/IReactionConfig';
import { metadata } from '../manageMetadata';

export const OnInit = (
  target: object,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  metadata.update(target, (allMetadata) => {
    // Add the reaction handler to the instance meta data
    allMetadata.initHandler = {
      handlerKey: propertyKey,
    };
    return allMetadata;
  });
};
