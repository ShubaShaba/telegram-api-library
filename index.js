const sendRequest = require("./src/request");
const startPolling = require("./src/polling");
const tokenConfig = require("./config"); // const tokenConfig = require("./configExample");

const path = require("path");
const EventEmitter = require("events");

class TelegramBot extends EventEmitter {
  constructor(token) {
    super();
    this.token = token;
  }
  sendMessage(chat_id, text) {
    const reqOptions = { tgMethod: "sendMessage", method: "GET" };

    const messageOptions = { chat_id: chat_id, text: text };

    const fileOptions = null;
    sendRequest(this.token, reqOptions, messageOptions, fileOptions);
  }

  sendPhoto(chat_id, pathToFile, caption) {
    let filename = path.basename(pathToFile);

    const reqOptions = { tgMethod: "sendPhoto", method: "POST" };
    let messageOptions = { chat_id: chat_id };

    if (caption) {
      messageOptions.caption = caption;
    }

    const fileOptions = {
      path: pathToFile,
      type: "photo",
      filename: filename
    };
    sendRequest(this.token, reqOptions, messageOptions, fileOptions);
  }

  setPolling() {
    startPolling(this.token, { timeout: 100 }, msg => {
      this.emit("message", msg);

      if (msg.text) {
        this.emit("text", msg);
      } else if (msg.photo) {
        this.emit("photo", msg);
      }
    });
  }
}

// let bot = new TelegramBot(tokenConfig.token);

// bot.setPolling();

// bot.on("message", function(msg) {
//   console.log(msg);
// });

module.exports = TelegramBot;
