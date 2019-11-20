const sendRequest = require("./src/request");
const startPolling = require("./src/polling");
const url = require("url");

const path = require("path");
const EventEmitter = require("events");

const messageTypes = [
  "text",
  "animation",
  "audio",
  "channel_chat_created",
  "contact",
  "delete_chat_photo",
  "document",
  "game",
  "group_chat_created",
  "invoice",
  "left_chat_member",
  "location",
  "migrate_from_chat_id",
  "migrate_to_chat_id",
  "new_chat_members",
  "new_chat_photo",
  "new_chat_title",
  "passport_data",
  "photo",
  "pinned_message",
  "poll",
  "sticker",
  "successful_payment",
  "supergroup_chat_created",
  "video",
  "video_note",
  "voice"
];

function sendData(
  chat_id,
  tgMethodm,
  pathToFile,
  token,
  type,
  caption,
  callback
) {
  const URL = url.parse(pathToFile);

  let reqOptions = { tgMethod: tgMethodm, method: "POST" };
  let messageOptions = { chat_id: chat_id };

  if (caption) {
    messageOptions.caption = caption;
  }

  if (URL.protocol) {
    reqOptions.method = "GET";
    messageOptions.photo = pathToFile;

    sendRequest(token, reqOptions, messageOptions, null, callback);
  } else {
    let filename = path.basename(pathToFile);

    const fileOptions = {
      path: pathToFile,
      type: type,
      filename: filename
    };
    sendRequest(token, reqOptions, messageOptions, fileOptions, callback);
  }
}

class TelegramBot extends EventEmitter {
  constructor(token) {
    super();
    this.token = token;
  }
  sendMessage(chat_id, text, callback) {
    const reqOptions = { tgMethod: "sendMessage", method: "GET" };

    const messageOptions = { chat_id: chat_id, text: text };

    const fileOptions = null;
    sendRequest(this.token, reqOptions, messageOptions, fileOptions, callback);
  }

  sendDocument(chat_id, pathToFile, caption, callback) {
    sendData(
      chat_id,
      "sendDocument",
      pathToFile,
      this.token,
      "document",
      caption,
      callback
    );
  }

  sendAudio(chat_id, pathToFile, caption, callback) {
    sendData(
      chat_id,
      "sendAudio",
      pathToFile,
      this.token,
      "audio",
      caption,
      callback
    );
  }

  sendPhoto(chat_id, pathToFile, caption, callback) {
    sendData(
      chat_id,
      "sendPhoto",
      pathToFile,
      this.token,
      "photo",
      caption,
      callback
    );
  }

  setPolling(callback) {
    startPolling(this.token, { timeout: 100 }, msg => {
      this.emit("message", msg);

      const dataType = messageTypes.find(type => msg[type]);
      this.emit(dataType, msg);

      if (callback) {
        callback(dataType, msg);
      }
    });
  }
}

module.exports = TelegramBot;
