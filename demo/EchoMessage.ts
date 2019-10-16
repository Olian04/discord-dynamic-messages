import { DynamicMessage } from '../src/api';

export class EchoMessage extends DynamicMessage {
  constructor(private toEcho: string) {
    super();
  }

  public render() {
    return this.toEcho;
  }
}
