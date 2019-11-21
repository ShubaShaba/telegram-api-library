const TelegramBot = require("./index");
const tokenConfig = require("./config"); // const tokenConfig = require("./configExample");

const bot = new TelegramBot(tokenConfig.token);

bot.setPolling((type, message) => {
  console.log(type, message);
  bot.sendMessage("id", JSON.stringify(message));
});
// or just start polling with bot.setPolling();

global.bot = bot; //optional

bot.sendMessage("id", "It's working");
// you can set as third argument callback function:

bot.sendMessage("id", "It's working", data => {
  console.log(data);
});

// bot.sendPhoto(id, "path" or url, caption(optional), callbackFunc(optional));

// bot.sendDocument(id, "path" or url, caption(optional), callbackFunc(optional));

// bot.sendAudio(id, "path" or url, caption(optional), callbackFunc(optional));
