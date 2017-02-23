'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;

const mysql = require('mysql');
let connection = mysql.createConnection({
  host: '52.39.43.206',
  user: 'test',
  password: 'test',
  database: 'ser322'
});

let jsonQueryResponse = (response, query, singular) => {
  connection.query(query, function (error, results, fields) {
    if (error) throw error;

    let result = singular ? results[0] : results;
    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify(result));
  });
};

let jsonSaveQuery = (response, query) => {
  connection.query(query, (err) => {
    if (err) {
      throw err;
    }
    response.status(200).send('Deck saved.');
  })
};

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(function (req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  next();
});

app.get('/api/cards/:attribute/:value', (request, response) => {
  let query = `SELECT C.*, S.name as setName FROM cards as C
               JOIN sets S on C.set = S.code
               WHERE C.${request.params.attribute} like "%${request.params.value}%"`;

  jsonQueryResponse(response, query, null);
});

app.use(express.static('public'));


app.get('/api/:table/:attribute/:value', (request, response) => {
  let query = `SELECT * FROM ${request.params.table}
                WHERE ${request.params.attribute} like "%${request.params.value}%"`;
  jsonQueryResponse(response, query, null);
});

app.get('/api/:table/:id?', (request, response) => {
  let query = `SELECT * FROM ${request.params.table}`;
  let singular = true;

  let id = request.params.id;
  id ? (query += ` WHERE id = "${id}"`) : (singular = false);

  jsonQueryResponse(response, query, singular);
});

app.post('/api/decks/save', (request, response) => {
  let name = request.body.name;
  let format = request.body.format;
  let archetype = request.body.archetype;
  let colorCombo = request.body.colorCombo.name;

  let badRequest = !(name && format && archetype && colorCombo);

  if (badRequest) {
    response.status(400).send("Bad Request, missing data");
  } else {
    let query = `INSERT INTO ser322.decks (name, format, archetype, comboName)
                  VALUES ('${name}', '${format}', '${archetype}', '${colorCombo}')`;
    jsonSaveQuery(response, query);
  }
});
app.on('close', () => {
  connection.end();
});

app.listen(port, (err) => {
  if (err) {
    return console.log('failed to launch', err);
  }
  console.log(`server is listening on ${port}`);
});

app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send('Something broke!')
});
