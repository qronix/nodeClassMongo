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

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // },(err,result)=>{
    //     if(err){
    //         return console.log('Unable to insert todo',err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // db.collection('Users').insertOne({
    //     name:'Jon',
    //     age:27,
    //     location:'Coming from the bottom'
    // },(err,result)=>{
    //     if(err){
    //         return console.log(`Unable to insert into database ${err}`);
    //     }
    //     // console.log(JSON.stringify(result.ops,undefined,2));
    //     let time = result.ops[0]._id.getTimestamp();
    //     console.log(JSON.stringify(time,undefined,2));
    // });
    client.close();
});