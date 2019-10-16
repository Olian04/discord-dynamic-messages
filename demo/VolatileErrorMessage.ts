import { DynamicMessage } from '../src/api';

export class VolatileErrorMessage extends DynamicMessage {
  constructor() {
    super();
  }

  public render() {
    return 'This message will throw a volatile error when reassigned to a new discord message';
  }
}
