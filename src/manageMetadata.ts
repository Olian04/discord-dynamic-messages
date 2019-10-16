import 'reflect-metadata';
import { IMetadata } from './interfaces';

const PROPERTY_METADATA_KEY = Symbol('propertyMetadata');
const initialMetadata = (): IMetadata => ({
  reactionHandlers: {},
  numberOfRegisteredReactionHandlers: 0,
});

export const getMetadata = (target: object) => {
  // Pull the existing metadata or create an empty object
  return Reflect.getMetadata(PROPERTY_METADATA_KEY, target) || initialMetadata();
};

export const updateMetadata = (target, cb: (metadata: IMetadata) => IMetadata) => {
  // Pull the existing metadata
  let allMetadata: IMetadata = getMetadata(target);

  allMetadata = cb(allMetadata);

  // Update the metadata
  Reflect.defineMetadata(
    PROPERTY_METADATA_KEY,
    allMetadata,
    target,
  );
};
