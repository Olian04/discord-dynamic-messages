// tslint:disable
import { DynamicMessage, OnReaction, OnReactionRemoved } from "../old_src/api";

export class ToggleMessage extends DynamicMessage {
  private toggle: boolean = false;

  @OnReaction(":thumbsup:", {
    removeWhenDone: false,
  })
  public on() {
    this.toggle = true;
  }

  @OnReactionRemoved(":thumbsup:")
  public off() {
    this.toggle = false;
  }

  public render() {
    return '```diff\n' + (this.toggle ? '+ on' : '- off') + '\n```';
  }
}
