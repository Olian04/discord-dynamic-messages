import { MetadataHandler } from 'ts-metadata-handler';
import { IMetadata } from './interfaces';

export const metadata = new MetadataHandler<IMetadata>(() => ({
  reactionHandlers: {},
  numberOfRegisteredReactionHandlers: 0,
}));
