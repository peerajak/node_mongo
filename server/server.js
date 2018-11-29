require('./config/config.js');
const _ = require('lodash');
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

app.delete('/todos/:id', (req,res)=>{
  var id = req.params.id;
    console.log('todos/:id');
  if(!ObjectID.isValid(id)){
    console.log('object id invalid');
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo)=>{
    if(!todo){
      console.log('object to delete id not found');
      return res.status(404).send();
    }
    res.send({todo});
  },(e)=>{
    res.status(400).send(e);
  });
});

app.patch('/todos/:id', (req,res) =>{
  var id = req.params.id;
  var body = _.pick(req.body,['text','completed']) // if text,completed key exist, update them
  console.log('todos/:id');
  if(!ObjectID.isValid(id)){
    console.log('object id invalid');
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  }else{
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id,{$set: body},{new: true}).then((todo)=>{
    if(!todo){
      console.log('object to delete id not found');
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e)=>{
    res.status(400).send();
  })

});



//POST /users
app.post('/users', (req,res)=>{
  var body = _.pick(req.body,['email','password'])
  var user = new User({
    email: body.email,
    password: body.password
  })
  user.save().then(()=>{
    //res.status(200).send(user);
    return user.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth',token).send(user);
  }).catch((e)=>{
    res.status(400).send(e);
  });
});


app.listen(port, ()=>{
  console.log(`Started on port ${port}`);
})


module.exports = {app}
