import {TelegramClient} from "telegram";
import {StringSession} from "telegram/sessions/index.js";
import readline from "readline";
import {NewMessage} from "telegram/events/index.js";

const apiId = 25218748;
const apiHash = "99c136a6c78083e2ed5da484b8d8dd00";
const stringSession = new StringSession("");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

(async () => {
  console.log("Loading interactive example...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  await client.start({
    phoneNumber: async () =>
      new Promise((resolve) =>
        rl.question("Please enter your number: ", resolve)
      ),
    password: async () =>
      new Promise((resolve) =>
        rl.question("Please enter your password: ", resolve)
      ),
    phoneCode: async () =>
      new Promise((resolve) =>
        rl.question("Please enter the code you received: ", resolve)
      ),
    onError: (err) => console.log(err),
  });
  console.log("You should now be connected.");
  console.log(client.session.save());
  await client.sendMessage("me", {message: "Hello!"});
  rl.close();


  client.addEventHandler(async (event) => {
    const message = event.message;
    console.log(`📩 Nuovo messaggio da ${JSON.stringify(await message.getSender())}: ${message.message}`);
  }, new NewMessage({}));


})();
