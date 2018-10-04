// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();

console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client)=>{
    if(err){
        return console.log('Could not connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    // db.collection('Users').deleteMany({name:"Jon"}).then((result)=>{
    //     console.log(result);
    // });

    db.collection('Users').findOneAndDelete({_id: new ObjectID('5bb4be5dd0b6b17104a069cb')}).then((result=>{
        console.log(result);
    }));

    // client.close();
});