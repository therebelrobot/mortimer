/* This examples show how easy it is to expose a simple CRUD REST interface on
 * top of a fictional books collection.
 *
 * Mortimer believes that route paths should be determined by the client
 * (ie. you) so it will not enforce andy routing pattern, it will only expose
 * handler methods. However please note that the :bookId token is de default
 * value for matching document ids in urls. It can however be changed, please
 * refer to the Resource constructor in the documentation.
 *
 * Note! That the PUT verb is not defined. PUT implies replacing the resource
 * completely, something that is more contrived to achieve with mongoose.
 * Instead PATCH acts as regular update, simply merging the payload with the
 * existing resource.
 *
 * To run, simply:
 *  $ node ./quick-bootstrap.js
 *
 * To test:
 *  $ curl -XPOST http://localhost:3000/books -H 'Content-type: application/json' -d '{"title": "Brothers Karamazov", "author": "Feodor Dostoevsky"}'
 *  $ {"meta":{},"data":{"__v":0,"title":"Brothers Karamazov","author":"Feodor Dostoevsky","_id":"54b8d3f6c9f63bce07386878"}}
 *
 *  $ curl -XGET http://localhost:3000/books
 *  $ {"meta":{},"data":[{"_id":"54b8d3f6c9f63bce07386878","title":"Brothers Karamazov","author":"Fyodor Dostoevsky","__v":0}]}
 *
 *  $ curl -XGET http://localhost:3000/books/54b8d3f6c9f63bce07386878
 *  $ {"meta":{},"data":{"_id":"54b8d3f6c9f63bce07386878","title":"Brothers Karamazov","author":"Feodor Dostoevsky","__v":0}}
 *
 *  $ curl -XPOST http://localhost:3000/books -H 'Content-type: application/json' -d '{"title": "Crime and Punishment", "author": "Feodor Dostoevsky"}'
 *  $ {"meta":{},"data":{"__v":0,"title":"Brothers Karamazov","author":"Feodor Dostoevsky","_id":"54b8d3f6c9f63bce07386124"}}
 *
 *  $ curl -XGET http://localhost:3000/books/count
 *  $ {"meta":{},"data":2}
 *
 *  $ curl -XPATCH http://localhost:3000/books/54b8d3f6c9f63bce07386878 -H 'Content-type: application/json' -d '{"author": "Fyodor Dostoevsky"}'
 *  $ {"meta":{},"data":{"_id":"54b8d3f6c9f63bce07386878","title":"Brothers Karamazov","author":"Fyodor Dostoevsky","__v":1}}
 *
 *  $ curl -XPUT http://localhost:3000/books/54b8d3f6c9f63bce07386124 -H 'Content-type: application/json' -d '{"author": "Fyodor Dostoevsky", "title": "Crime & Punishment"}'
 *  $ {"meta":{},"data":{"_id":"54b8d3f6c9f63bce07386124","title":"Crime & Punishement","author":"Fyodor Dostoevsky","__v":0}}
 *
 *  $ curl -XPATCH http://localhost:3000/books -H 'Content-type: application/json' -d '{"author": "Greatest Russian Author Ever!"}'
 *  $ {"meta":{}}
 *
 *  $ curl -XDELETE http://localhost:3000/books
 */


const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const mortimer = require('../lib/'); // require('mortimer');


// Handle connection to mongodb and data modeling.
mongoose.connect('mongodb://localhost:27017/examples');

const BookSchema = new mongoose.Schema({
    'title': {type: String},
    'author': {type: String}
});
const Book = mongoose.model('Book', BookSchema);


// Setup http server with express.
const app = express();
app.set('query parser', 'simple');
app.use(bodyParser.json());


// Setup mortimer endpoints.
const resource = new mortimer.Resource(Book);
app.post('/books', resource.createDoc());
app.get('/books', resource.readDocs());
app.get('/books/count', resource.countDocs());
app.patch('/books', resource.patchDocs());
app.delete('/books', resource.removeDocs());
app.get('/books/:bookId', resource.readDoc());
app.patch('/books/:bookId', resource.patchDoc());
app.put('/books/:bookId', resource.putDoc());
app.delete('/books/:bookId', resource.removeDoc());


// Start the http server on http://localhost:3000/
app.listen(3000, 'localhost');
