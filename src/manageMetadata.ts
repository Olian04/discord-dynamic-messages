import { MetadataHandler } from 'ts-metadata-handler';
import { IMetadata } from './interfaces/IMetadata';

export const metadata = new MetadataHandler<IMetadata>(() => ({
  initHandler: undefined,
  reactionHandlers: {},
  reactionRemovedHandlers: {},
  catchAllReactionHandler: undefined,
  catchAllReactionRemovedHandler: undefined,
  numberOfRegisteredReactionHandlers: 0,
}));
