import { DynamicMessage } from '../src/api';

export class TameErrorMessage extends DynamicMessage {
  constructor() {
    super({
      volatile: false,
      onError: (err) => {
        // tslint:disable-next-line:no-console
        console.error(err);
      },
    });
  }

  public render() {
    return 'This message will throw a tame error when reassigned to a new discord message';
  }
}
