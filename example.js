const TelegramBot = require("./index");
const tokenConfig = require("./config"); // const tokenConfig = require("./configExample");

let bot = new TelegramBot(tokenConfig.token);
bot.setPolling();

// bot.sendMessage( your id, "It's working");
