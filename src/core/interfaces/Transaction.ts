interface ReactionTransaction {
  subject: 'reaction';
  operation: 'add' | 'remove';
  arguments: [ string ];
}

interface ContentTransaction {
  subject: 'content';
  operation: 'update';
  arguments: [ string ];
}

export type Transaction = ReactionTransaction | ContentTransaction;
export type Subjects = Transaction['subject'];
export type Operations<Subject extends Subjects> =
  Subject extends 'reaction' ? ReactionTransaction['operation'] :
  Subject extends 'content' ? ContentTransaction['operation'] :
  never;

export type Arguments<Subject extends Subjects> =
  Subject extends 'reaction' ? ReactionTransaction['arguments'] :
  Subject extends 'content' ? ContentTransaction['arguments'] :
  never;
