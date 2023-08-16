const fs = require('fs');
const { send, send404, send500, sendJson, getRoutePar, convertBodyToJsObject } = require('./httpcontext')
const db = require('./db.json');


function getDB(req, res) {

  fs.readFile('./db.json', 'utf8', (err, data) => {
    if (err) {
      send500(res);
    } else {
      const db = JSON.parse(data);
      sendJson(res, db);
    }
  });
}


/////
function getStudents(req, res) {
  sendJson(res, db.students);
}

/////

function getItems(req, res) {
  fs.readFile('./items.json', 'utf8', (err, data) => {
    if (err) {
      send500(res);
    } else {
      const items = JSON.parse(data);
      sendJson(res, items)
    }
  });
}

function getItem(req, res) {

  const id = getRoutePar(req.url);

  fs.readFile('./items.json', 'utf8', (err, data) => {
    if (err) {
      send500(res);
    } else {

      const items = JSON.parse(data);
      const item = items.find(item => item.id === id);
      if (item) {
        sendJson(res, item)
      } else {
        send404(res);
      }
    }
  });
}

function postItem(req, res) {

  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {

    let newItem = convertBodyToJsObject(req, body);

    fs.readFile('./items.json', 'utf8', (err, data) => {
      if (err) {
        send500(res);
      } else {

        const items = JSON.parse(data);
        newItem.id = items.length + 1;
        items.push(newItem);

        fs.writeFile('./items.json', JSON.stringify(items), err => {
          if (err) {
            send500(res);
          } else {
            sendJson(res, newItem, 201);
          }
        });

      }
    });
  });
}


function putItem(req, res) {

  const id = getRoutePar(req.url);

  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {

    let updatedItem = convertBodyToJsObject(req, body);

    fs.readFile('./items.json', 'utf8', (err, data) => {
      if (err) {
        send500(res);
      } else {

        const items = JSON.parse(data);

        console.log('handlePut', id, updatedItem, items);

        const i = items.findIndex(item => item.id === id);
        if (i !== -1) {
          items[i] = { ...items[i], ...updatedItem, id };

          fs.writeFile('./items.json', JSON.stringify(items), err => {
            if (err) {
              send500(res);
            } else {
              sendJson(res, items[i]);
            }
          });

        } else {
          send404(res);
        }
      }
    });
  });
}

function deleteItem(req, res) {

  const id = getRoutePar(req.url);

  fs.readFile('./items.json', 'utf8', (err, data) => {
    if (err) {
      send500(res);
    } else {
      const items = JSON.parse(data);
      const i = items.findIndex(item => item.id === id);
      if (i !== -1) {
        const deletedItem = items.splice(i, 1)[0];
        fs.writeFile('./items.json', JSON.stringify(items), err => {
          if (err) {
            send500(res);
            console.log(`error: ${err}`);
          } else {
            sendJson(res, deletedItem);
          }
        });
      } else {
        send404(res);
      }
    }
  });
}

module.exports = {
  getDB, getStudents, getItems, getItem, postItem, putItem, deleteItem
};
