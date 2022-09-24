var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Connect to the database
mongoose.connect('mongodb://localhost:27017/todo', {useNewUrlParser: true, useUnifiedTopology: true});

// Create a schema = this is like a blueprint
var todoSchema = new mongoose.Schema({
  item: String
});

var Todo = mongoose.model('Todo', todoSchema);

/*
var itemOne = Todo({item: 'Buy flowers'}).save(function (err){
  if(err) throw err;
  console.log('item saved');
});
*/

// var data = [{item: 'get milk'}, {item: 'walk dog'}, {item: 'kick some coding ass'}];

var urllencodeParser = bodyParser.urlencoded({extended: false});

module.exports = function (app){
  app.get('/todo', function (req, res) {
    // Get data from mongodb amd pass it to view
    Todo.find({}, function (err, data){
      if(err) throw err;
      res.render('todo', {todos: data});
    });
  });

  app.post('/todo', urllencodeParser, function (req, res) {
    // Get data from the view and add it to mongodb
    var newTodo = Todo(req.body).save(function (err, data) {
      if (err) throw err;
      res.json(data);
    });
    // data.push(req.body);
    // res.json(data);
  });

  app.delete('/todo/:item', function (req, res) {
    // delete the requested item from mongodb
    Todo.find({item: req.params.item.replace(/\-/g," ")}).deleteOne(function (err, data){
      if(err) throw err;
      res.json(data);
    });
    /*
    data = data.filter(function (todo) {
      return todo.item.replace(/ /g, '-') !== req.params.item;
    });
    res.json(data);
    */
  });
}
