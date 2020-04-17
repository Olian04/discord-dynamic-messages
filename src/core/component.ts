import { EventEmitter } from 'events';
import { Transaction, Operations, Subjects, Arguments } from './interfaces/Transaction';
import { setContext } from './contextHandler';

export class Component {
  private eventEmitter: EventEmitter;
  private renderHooks: { [key: string]: boolean; } = {};
  public cachedContent: string = null;
  constructor(
    private setup: () => string,
    private handelTransaction: (transaction: Transaction) => void,
  ) {
    this.eventEmitter = new EventEmitter({
      captureRejections: true,
    });
    this.render();
  };

  private constructEventName<Subject extends Subjects>(subject: Subject, operation: Operations<Subject>) {
    return [subject, operation].join(':');
  }

  private render() {
    setContext(this);
    const newContent = this.setup();
    if (newContent !== this.cachedContent) {
      this.commitTransaction({
        subject: 'content',
        operation: 'update',
        arguments: [ newContent ],
      });
      this.cachedContent = newContent;
    }
  }

  public triggerEvent<Subject extends Subjects>(subject: Subject, operation: Operations<Subject>, ...args: Arguments<Subject>) {
    const eventName = this.constructEventName(subject, operation);
    if (this.eventEmitter.listenerCount(eventName) === 0) {
      // Something happened that the message does not care about.
      return;
     }
     this.eventEmitter.emit(eventName, ...args);
     this.render();
  }

  public on<Subject extends Subjects>(subject: Subject, operation: Operations<Subject>, handler: (...args: Arguments<Subject>) => void) {
    const eventName = this.constructEventName(subject, operation);
    this.eventEmitter.on(eventName, handler);
  };

  public off<Subject extends Subjects>(subject: Subject, operation: Operations<Subject>, handler: (...args: Arguments<Subject>) => void) {
    const eventName = this.constructEventName(subject, operation);
    this.eventEmitter.off(eventName, handler);
  };

  public once<Subject extends Subjects>(subject: Subject, operation: Operations<Subject>, handler: (...args: Arguments<Subject>) => void) {
    const eventName = this.constructEventName(subject, operation);
    this.eventEmitter.once(eventName, handler);
  };

  public commitTransaction(transaction: Transaction) {
    this.handelTransaction(transaction);
  };
}