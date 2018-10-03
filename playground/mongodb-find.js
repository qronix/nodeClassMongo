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

    // db.collection('Todos').find({
    //     _id: new ObjectID('5bb3e1ddbf489a3098fb850c')
    // }).toArray().then((docs)=>{
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs,undefined,2));
    // },(err)=>{
    //     console.log(`Unable to fetch todos`, err);
    // });

    // db.collection('Todos').find().count().then((count)=>{
    //     console.log(`Todos count: ${count}`);
    // },(err)=>{
    //     console.log(`Unable to fetch todos`, err);
    // });

    db.collection('Users').find({name:"Anthony"}).toArray().then((docs)=>{
        console.log('Users');
        console.log(JSON.stringify(docs,undefined,2));
    },(err)=>{
        console.log(`Unable to retrieve records: ${err}`);
    });
    db.collection('Users').find().count().then((count)=>{
        console.log(`Users contains ${count} documents`);
    },(err)=>{
        console.log(`Unable to retrieve count: ${err}`);
    });

    // client.close();
});