const sendRequest = require("./src/request");

const path = require("path");
const fs = require("fs");
const EventEmitter = require("events");

class TelegramBot {
  constructor(token) {
    this.token = token;

    this.sendMessage = function(chat_id, text) {
      const reqOptions = { tgMethod: "sendMessage", method: "GET" };

      const messageOptions = { chat_id: chat_id, text: text };

      const fileOptions = null;
      sendRequest(this.token, reqOptions, messageOptions, fileOptions);
    };

    this.sendPhoto = function(chat_id, pathToFile, caption) {
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
    };
  }
}

// class TelegramBot extends EventEmitter{

// }

let bot = new TelegramBot("1061648762:AAED3X814nZeCizj1545QONZmARIDAp4eQQ");

module.exports = TelegramBot;
