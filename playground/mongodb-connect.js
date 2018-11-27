//const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
  if(err){
    return console.log('Unable to connect to Mongo db Server');
  }

  console.log('Connected to Mongo db Server');
/*
  db.collection('Users1').insertOne({
    name:"Peerajak",
    age: 42,
    location: "Bangkok"
  },(err,result)=>{
    if(err){
      return console.log('Cannot insertOne',err);
    }
    console.log(JSON.stringify(result.ops[0]._id.getTimestamp(),undefined,2));
  });
*/
db.collection('Users1').find({
  name: 'Peerajak'
}).count().then((numfound)=>{
      console.log(numfound);
},(err)=>{
        return console.log('Cannot find',err);
});
  db.close();
});
