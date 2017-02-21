'use strict';
const express = require('express');
const app = express();
const port = 8080;

const mysql = require('mysql');
let connection = mysql.createConnection({
  host: '52.39.43.206',
  user: 'test',
  password: 'test',
  database: 'ser322',
});

let jsonQueryResponse = (response, query, singular) => {
  connection.query(query, function (error, results, fields) {
    if (error) throw error;

    let result = singular ? results[0] : results;
    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify(result));
  });
};

app.listen(port, (err) => {
  if (err) {
    return console.log('failed to launch', err);
  }

  console.log(`server is listening on ${port}`);
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

app.on('close', () => {
  connection.end();
});

app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send('Something broke!')
});
