// tslint:disable
import { expect } from "chai";
import { Message } from "discord.js";
import { emoji } from "node-emoji";
import { DynamicMessage, OnReaction, OnReactionRemoved } from "../src/api";
import { extractCommand } from "./util/command";
import { describe, it } from "./util/testCase";

export class ToggleMessage extends DynamicMessage {
  private toggle: boolean = false;
  constructor() {
    super();
  }

  @OnReaction(":thumbsup:")
  public on() {
    this.toggle = true;
  }

  @OnReactionRemoved(":thumbsup:")
  public off() {
    this.toggle = false;
  }

  public render() {
    return '```diff\n' + (this.toggle ? '- off' : '+ on' + '\n```');
  }
}

export const testToggle = async (msg: Message) =>
  describe("ToggleMessage", () => {
    it("should trigger on & off", async () => {
      const [_, ...args] = extractCommand(msg.content);
      const toggleMessage = await new ToggleMessage().sendTo(msg.channel);

      // TODO: Write test
    });
  });
