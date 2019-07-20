# discordjs-dynamic-messages

```ts
import {
  DynamicMessage,
  OnReaction,
} from 'discordjs-decorators';

@DynamicMessage
class CounterMessage {
  private counter = 0;

  @OnReaction(':thumbsup:', {
    removedWhenDone: true, // default
    triggersRender: true, // default
    includeBots: false, // default
  })
  increment(user, channel) {
    this.counter += 1;
  }
  
  @OnReaction(':thumbsdown:')
  increment(user, channel) {
    this.counter -= 1;
  }
  
  render() {
    return {
      content: `Counter: ${}`
    };
  }
}
```
