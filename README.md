# SER 322 Final Project

### Introduction

#### API
This is a simple API which maps tables and id values into HTTP calls for access through a JSON api. To use please follow the instructions listed below.

#### Front-end
This is a very basic front end which allows for the construction of decks out of Magic: The Gathering cards, and lets you search the last 6 sets of cards (3 blocks) to make your deck.

### Installation
1. git clone git@github.com:slaughter550/ser322-final-project.git
2. cd ser322-final-project
3. npm install
4. node server.js &
5. bower install
6. grunt serve &
8. navigate to http://localhost:3000 if grunt doesn't launch your browser for you (it should)

### Usage

| URI | SQL | Result |
| ------------- |-------------| -----|
| / | none | returns public/index.html |
| /api/blocks | SELECT * FROM blocks | returns all blocks as a collection|
| /api/blocks/1 | SELECT * FROM blocks WHERE id = 1 | returns a singular block|
| /api/cards | SELECT * FROM cards | returns all cards as a collection |
| /api/cards/{id} | SELECT * FROM cards WHERE id = {id}| returns a singular card |


### Notes
* The id's for cards are 40 characters - 01ed037fb95db020884b2f3c768ef279ab366c5b is an example.
* To see .js changes, the node server must restart for the new changes to take effect
* All public assets are located in the public folder
