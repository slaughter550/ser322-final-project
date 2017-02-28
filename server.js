'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;
const mysql = require('mysql');

//Establish connection to MySQL database.
let connection = mysql.createConnection({
  host: '52.39.43.206',
  user: 'test',
  password: 'test',
  database: 'ser322'
});

//Logging function to see what query is being run.
let logQuery = (query, req) => {
  console.log('--------------------------------------------');
  console.log(new Date());
  console.log(query);
};

//Helper function to execute a generic query.
let jsonQueryResponse = (response, query, singular) => {
  connection.query(query, function (error, results, fields) {
    if (error) throw error;

    let result = singular ? results[0] : results;
    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify(result));
  });
};

//A helper function for saving decks. No results are sent since it's an insert query.
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
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

//Allow any origin to make GET and POST requests.
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  next();
});

/**
 * Endpoint to get cards based on a search query. Not written with RPC style URLs for future
 * modification to support searching by multiple optional parameters.
 */
app.get('/api/cards', (request, response) => {
  let value = request.query.value;
  let deckID = request.query.deckid;
  let query = `SELECT * 
              FROM   ser322.cards CARDS 
                     LEFT JOIN ser322.cardstodecks CTD 
                            ON CTD.cardid = CARDS.id 
              WHERE  CARDS.name  LIKE '%${value}%' 
                     AND CARDS.id NOT IN (SELECT cardid 
                                          FROM   ser322.cardstodecks 
                                          WHERE  deckid = ${deckID}) 
              UNION 
              SELECT * 
              FROM   ser322.cards CARDS 
                     JOIN ser322.cardstodecks CTD 
                       ON CTD.cardid = CARDS.id 
              WHERE  CARDS.name LIKE '%${value}%'
                     AND CTD.deckid = ${deckID}; `;
  logQuery(query, request);

  jsonQueryResponse(response, query, null);
});


/**
 * End point for searching a specific table for a specific attribute and its value. The value is
 * open ended so it will return matches where that string is anywhere in appropriate attribute.
 */
app.get('/api/:table/:attribute/:value', (request, response) => {
  let query = `SELECT * FROM ${request.params.table}
                WHERE ${request.params.attribute} like "%${request.params.value}%"`;
  logQuery(query, request);
  jsonQueryResponse(response, query, null);
});

/**
 * End point to retrieve full table of data or a specific id's data.
 */
app.get('/api/:table/:id?', (request, response) => {
  let query = `SELECT * FROM ${request.params.table}`;
  let singular = true;

  let id = request.params.id;
  id ? (query += ` WHERE id = "${id}"`) : (singular = false);

  jsonQueryResponse(response, query, singular);
});

/**
 * End point to allow for saving a deck. Once saved, the deck is available for editing to add/remove cards.
 */
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
    logQuery(query, request);
    jsonSaveQuery(response, query);
  }
});

/**
 * End point to remove a deck and all cards associated with that deck.
 */
app.post('/api/decks/remove/:id', (req, res) => {
  let deckID = req.params.id;
  let removeDeckQuery = `DELETE FROM ser322.decks WHERE ID = ${deckID};`;
  let removeDeckCardsQuery = `DELETE FROM ser322.cardstodecks WHERE deckID = ${deckID};`;

  logQuery(removeDeckQuery, req);
  logQuery(removeDeckCardsQuery, req);

  connection.query(removeDeckQuery, function (err) {
    if (err) throw err;
  });
  connection.query(removeDeckCardsQuery, function (err) {
    if (err) throw err;
  });

  res.status(200).send('Deck ' + deckID + ' removed.');
});

/**
 * End point to insert a quantity of cards into a deck
 */
app.post('/api/decks/addcards', (req, res) => {
  let cardID = req.body.cardID;
  let deckID = req.body.deckID;
  let quantity = req.body.quantity;

  let addCardQuery = `INSERT INTO ser322.cardstodecks (cardID, deckID, quantity) 
                      VALUES ('${cardID}', ${deckID}, ${quantity})
                      ON DUPLICATE KEY UPDATE quantity=${quantity};`;
  logQuery(addCardQuery, req);
  jsonSaveQuery(res, addCardQuery, null);
});

/**
 * End point to remove all of a specific card from a deck.
 */
app.post('/api/decks/removecards', (req, res) => {
  let cardID = req.body.cardID;
  let deckID = req.body.deckID;

  let removeCardQuery = `DELETE FROM ser322.cardstodecks
                         WHERE cardID = '${cardID}' and deckID = '${deckID}';`;
  logQuery(removeCardQuery, req);
  jsonSaveQuery(res, removeCardQuery, null);
});

//Start the server
app.listen(port, (err) => {
  if (err) {
    return console.log('failed to launch', err);
  }
  console.log(`server is listening on ${port}`);
});

//General response for server errors.
app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send('Something broke!')
});

//Close MySQL connection if the server exits for any reason.
app.on('close', () => {
  connection.end();
});
