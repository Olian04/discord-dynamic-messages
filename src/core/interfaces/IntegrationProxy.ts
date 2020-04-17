import { Transaction } from './Transaction';

export interface IntegrationProxy {
  handelTransaction(transaction: Transaction): void;
}