import { DynamicMessage, OnReaction } from '../src/index';

export class EchoMessage extends DynamicMessage {
  constructor(private toEcho: string) {
    super();
  }

  public render() {
    return this.toEcho;
  }
}
