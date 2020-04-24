import { BuilderFunction } from '../BuilderFunction';

type ContentType = ReturnType<BuilderFunction>;

export type ContentEffect = {
  subject: 'content';
  operation: 'update';
  arguments: [ ContentType ];
};
