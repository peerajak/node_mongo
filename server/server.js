var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('../db/mongoose');
var {Todo} = require('../models/todo');
var {User} = require('../models/user');

var app = express();
const port = process.env.PORT || 3000//Heroku or mine

app.use(bodyParser.json());

app.post('/todos', (req,res)=>{
  var todo = new Todo({
    text: req.body.text
  })
  todo.save().then((doc)=>{
    res.status(200).send(doc);
  },(e)=>{
    res.status(400).send(e);
  });
});


app.get('/todos', (req,res)=>{
  Todo.find().then((todos)=>{
    res.send({todos})
    console.log('object found');
  },(e)=>{
    console.log('object id invalid1');
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req,res)=>{
  var id = req.params.id;
    console.log('todos/:id');
  if(!ObjectID.isValid(id)){
    console.log('object id invalid');
    return res.status(404).send();
  }

  Todo.findById(id).then((todo)=>{
    if(!todo){
      console.log('object id not found');
      return res.status(404).send();
    }
    res.send({todo})
  },(e)=>{
    res.status(400).send(e);
  });
});

//POST /users
app.post('/users', (req,res)=>{
  var user = new User({
    text: req.body.text
  })
  todo.save().then((doc)=>{
    res.status(200).send(doc);
  },(e)=>{
    res.status(400).send(e);
  });
});


app.listen(port, ()=>{
  console.log('Started on port ${port}');
})


module.exports = {app}
