const { Buffer } = require("buffer");
const https = require("https");
const querystring = require("querystring");
const fs = require("fs");

function createBoundaryData(boundary, parameter, value) {
  let data = "";
  data += `--${boundary}\r\n`;
  data += `Content-Disposition: form-data; name="${parameter}"\r\n\r\n${value}\r\n`;

  return data;
}

function requestToTelegram(token, reqOptions, messageOption, fileOption) {
  const boundary = "--------------------------743265011915282242444548";
  let data = "";
  let buffer;
  let fileToSend;

  let qs;

  if (fileOption) {
    for (d in messageOption) {
      data += createBoundaryData(boundary, d, messageOption[d]);
    }
    data += `--${boundary}\r\n`;
    data += `Content-Disposition: form-data; name="${fileOption.type}"; filename="${fileOption.filename}"\r\n`;
    data += "Content-Type: application/octet-stream\r\n\r\n";

    buffer = Buffer.from(fs.readFileSync(fileOption.path, "hex"), "hex");

    fileToSend = Buffer.concat([
      Buffer.from(data, "utf8"),
      buffer,
      Buffer.from(`\r\n--${boundary}--\r\n`, "utf8")
    ]);
  } else {
    qs = querystring.stringify(messageOption);
  }

  let opt = {
    host: "api.telegram.org",
    hostname: "api.telegram.org",
    port: 443,
    path: `/bot${token}/${reqOptions.tgMethod}`,
    method: reqOptions.method,
    protocol: "https:"
  };

  if (fileToSend) {
    opt.headers = {
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
      "Content-Length": Buffer.byteLength(fileToSend)
    };
  } else if (qs) {
    opt.path += `?${qs}`;
  } else {
    console.error("no data to send");
  }

  let req = https.request(opt, function(res) {
    let buffer = [];

    res.on("data", chunck => {
      buffer.push(chunck);
    });

    res.on("end", () => {
      buffer = Buffer.concat(buffer);
      console.log(buffer.toString("utf8"));
    });
  });

  req.on("error", e => {
    console.error(`problem with request: ${e.message}`);
  });

  if (fileToSend) {
    req.write(fileToSend);
  }
  req.end();
}

module.exports = requestToTelegram;
