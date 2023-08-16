const fs = require('fs');
const path = require('path');
const { parse } = require('querystring');

const RequestMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

function send(res, data = 'OK', statusCode = 200, contentType = 'text/plain') {
  res.writeHead(statusCode, { 'Content-Type': contentType });
  res.end(data);

  console.log(res.req.method, res.req.url, res.statusCode, res.statusMessage ?? '');
}

function send404(res) {
  // res.writeHead(404);
  // res.end('Not Found');

  send(res, 'Not Found', 404);
}

function send500(res) {
  // res.writeHead(500);
  // res.end('Server Error');

  send(res, 'Server Error', 500);
}

function sendJson(res, data, statusCode = 200) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));

  console.log(res.req.method, res.req.url, res.statusCode, res.statusMessage ?? '');
}

function getRoutePar(url) {
  return parseInt(url.split('/').slice(-1));
}

function convertBodyToJsObject(req, body) {
  let newItem = parse(body);
  if (req.headers['content-type'] == "application/json") {
    newItem = JSON.parse(body);
  }
  return newItem;
}

function serveFile(res, filePath, contentType) {
  const fullPath = path.join(__dirname, filePath);

  fs.readFile(fullPath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        send(res, 'File Not Found', 404)
      } else {
        send500(res);
      }
    } else {
      // res.writeHead(200, { 'Content-Type': contentType || getContentType(filePath) });
      // res.end(content);
      send(res, content, 200, contentType || getContentType(filePath))
    }
  });
}

function getContentType(filePath) {
  const extname = path.extname(filePath);
  switch (extname) {
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.js':
      return 'text/javascript';
    case '.json':
      return 'application/json';
    case '.jpg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    // Add more cases for other file types as needed
    default:
      return 'application/octet-stream';
  }
}


module.exports = {
  RequestMethod, send, send404, send500, sendJson, getRoutePar, convertBodyToJsObject, serveFile
};
