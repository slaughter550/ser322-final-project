const express = require('express')
const app = express()
const port = 8080

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '52.39.43.206',
    user: 'test',
    password: 'test',
    database: 'ser322',
});

var jsonQueryResponse = function(response, query, singular) {
    connection.query(query, function(error, results, fields) {
        if (error) throw error;

        result = singular ? results[0] : results;
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

app.use(express.static('public'))

app.get('/api/:table/:id?', (request, response) => {
    var query = `SELECT * FROM ${request.params.table}`;
    var singular = true;

    var id = request.params.id;
    id ? (query += ` WHERE id = ${id}`) : (singular = false);

    jsonQueryResponse(response, query, singular);
})

app.on('close', () => {
    connection.end();
});

app.use((err, request, response, next) => {
    console.log(err)
    response.status(500).send('Something broke!')
})
