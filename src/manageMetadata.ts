import { MetadataHandler } from 'ts-metadata-handler';
import { IMetadata } from './interfaces/IMetadata';

export const metadata = new MetadataHandler<IMetadata>(() => ({
  reactionHandlers: {},
  numberOfRegisteredReactionHandlers: 0,
}));
