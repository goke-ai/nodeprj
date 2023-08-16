const http = require('http');
// const fs = require('fs');
// const path = require('path');
// const { parse } = require('querystring');
const { RequestMethod, serveFile, send, send404, send500, sendJson } = require('./httpcontext')
const controller = require('./controller')
const router = require('./router')

const db = require('./db.json');
const dbItems = require('./items.json');

const staticFolder = "public";

const server = http.createServer((req, res) => {
  const { method, url } = req;

  switch (method) {
    case RequestMethod.GET:
      getMethod(req, res);
      break;
    case RequestMethod.POST:
      postMethod(req, res);
      break;
    case RequestMethod.PUT:
      putMethod(req, res);
      break;
    case RequestMethod.DELETE:
      deleteMethod(req, res);
      break;
    default:
      send(res, 'Method Not Allowed', 405);
      break;
  }
});

const host = "127.0.0.1"
const port = 3000;
server.listen(port, host, () => {
  console.log(`Server is listening on http://${host}:${port}`);
});


// server functions
function getMethod(req, res) {
  if (router.getRouted(req, res)) { }
  else if (req.url === '/') {
    serveFile(res, `${staticFolder}/index.html`, 'text/html');
  }
  else {
    serveFile(res, `${staticFolder}${req.url}`);
  }
}

function postMethod(req, res) {
  if (router.postRouted(req, res)) { }
  else {
    send404(res);
  }
}

function putMethod(req, res) {
  if (router.putRouted(req, res)) { }
  else {
    send404(res);
  }
}

function deleteMethod(req, res) {
  if (router.deleteRouted(req, res)) { }
  else {
    send404(res);
  }
}


/// routing 
// get
router.get(
  '/api/items',
  (req, res) => {
    sendJson(res, dbItems);
  }
);

router.get(
  '/api/items/{id}',
  (req, res) => {
    const id = parseInt(req.url.split('/').slice(-1));
    let x = dbItems.find(f => f.id === id);
    sendJson(res, x);
  }
);

router.get(
  '/api/db',
  (req, res) => {
    sendJson(res, db);
  }
);

router.get(
  '/api/students',
  (req, res) => {
    sendJson(res, db.students);
  }
);

router.get(
  '/api/students/{id}',
  (req, res) => {
    const id = parseInt(req.url.split('/').slice(-1));
    let x = db.students.find(f => f.id === id);
    sendJson(res, x);
  }
);

// controller
router.get('/items', controller.getItems);
router.get('/items/{id}', controller.getItem);
router.get('/db', controller.getDB);
router.get('/students', controller.getStudents);

// post
router.post("/items", controller.postItem);

// put
router.put("/items/{id}", controller.putItem);

// delete
router.delet("/items/{id}", controller.deleteItem);


