import { Client } from "discord.js";
import * as path from "path";

import { dynamicMessage, dynamicMessageManager } from "./src/api";

const counterMessage = dynamicMessage("counter", "v1", () => {
  const [count, setCount] = useState("count", 0);
  const { onAdded, onRemoved, addSelf, removeSelf } = useReaction(":thumbsup:");
  const { onAdded: onCrossEmoji } = useReaction(":redcross:");
  const { detach } = useSelf();

  onCrossEmoji(() => {
    detach();
  });

  onAttached(() => {
    addSelf();
  });

  onDetached(() => {
    removeSelf();
  });

  onAdded(() => setCount((c) => c + 1));
  onRemoved(() => setCount((c) => c - 1));

  return `Count: ${count}`;
});

const dmm = new DynamicMessageManager({
  db: new FirebaseDBManager(firebaseConfig),
});

// tslint:disable-next-line no-var-requires
const secrets = require(path.resolve(__dirname, "..", "secrets.json"));

const client = new Client();

client.on("message", (message) => {
  if (message.channel.type !== "text") return;
  if (message.content !== "!count") return;

  dmm.sendTo(message.channel, counterMessage);
});

client
  .login(secrets.discord_token)
  .then(() => {
    // tslint:disable-next-line:no-console
    console.info(`Login successful`);
  })
  .catch((err) => {
    // tslint:disable-next-line:no-console
    console.error(`Login failed`);
    throw err;
  });
