import { MetadataHandler } from 'ts-metadata-handler';
import { IMetadata } from './interfaces/IMetadata';

export const metadata = new MetadataHandler<IMetadata>(() => ({
  reactionHandlers: {},
  reactionRemovedHandlers: {},
  numberOfRegisteredReactionHandlers: 0,
}));
