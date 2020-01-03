// tslint:disable-next-line:no-empty-interface
interface IDynamicMessageConfigBase {
  // nothing here so far
}
interface IDynamicMessageConfigTame extends IDynamicMessageConfigBase {
  volatile: false;
  onError: (error: Error) => void;
}
interface IDynamicMessageConfigVolatile extends IDynamicMessageConfigBase {
  volatile: true;
  onError?: (error: Error) => void;
}
export type IDynamicMessageConfig = IDynamicMessageConfigVolatile | IDynamicMessageConfigTame;
