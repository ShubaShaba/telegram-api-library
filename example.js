const TelegramBot = require("./index");
const tokenConfig = require("./config"); // const tokenConfig = require("./configExample");

let bot = new TelegramBot(tokenConfig.token);

bot.setPolling((type, message) => {
  console.log(type, message);
  bot.sendMessage("your id", JSON.stringify(message));
});

bot.sendMessage("your id", "It's working", data => {
  console.log(data);
});
