const https = require("https");
const querystring = require("querystring");
const { Buffer } = require("buffer");

function requestForUpdates(token, updateMethods, callback) {
  let opt = {
    host: "api.telegram.org",
    hostname: "api.telegram.org",
    port: 443,
    path: `/bot${token}/getUpdates`,
    method: "GET",
    protocol: "https:"
  };

  if (updateMethods) {
    let qs = querystring.stringify(updateMethods);
    opt.path += `?${qs}`;
  }

  let req = https.request(opt, res => {
    let buffer = [];

    res.on("data", chunck => {
      buffer.push(chunck);
    });

    res.on("end", () => {
      buffer = Buffer.concat(buffer);
      let string = buffer.toString("utf8");
      let object = JSON.parse(string);

      let offset = object.result[object.result.length - 1];
      let callBackMessage;

      if (offset) {
        callBackMessage = offset.message;
        offset = offset.update_id + 1;
      }

      let methods = { offset: offset, timeout: 100 };

      if (callBackMessage) {
        callback(callBackMessage);
      }

      requestForUpdates(token, methods, callback);
    });
  });

  req.end();
}

module.exports = requestForUpdates;
