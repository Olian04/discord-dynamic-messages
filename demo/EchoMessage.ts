import { DynamicMessage } from '../old_src/api';

export class EchoMessage extends DynamicMessage {
  constructor(private toEcho: string) {
    super();
  }

  public render() {
    return this.toEcho;
  }
}
