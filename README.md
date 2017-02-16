# SER 322 Final Project

### Introduction

This is a simple API which maps tables and id values into HTTP calls for access through a JSON api. To use please follow the instructions listed below.

### Installation
1. git clone git@github.com:slaughter550/ser322-final-project.git
2. cd ser322-final-project
3. npm install
4. node server.js
5. open [http://127.0.0.1:8080] (http://127.0.0.1:8080)

### Usage

| URI | SQL | Result |
| ------------- |-------------| -----|
| / | none | returns public/index.html |
| /api/blocks | SELECT * FROM blocks | returns all blocks as a collection|
| /api/blocks/1 | SELECT * FROM blocks WHERE id = 1 | returns a singular block|
| /api/cards | SELECT * FROM cards | returns all cards as a collection |
| /api/cards/1 | SELECT * FROM cards WHERE id = 1| returns a singular card |

### Notes
* To see .js changes, the node server must restart for the new changes to take effect
* All public assets are located in the public folder
