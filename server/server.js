const {ObjectID} = require('mongodb');
var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
    var todo = new Todo({
        text:req.body.text
    });

    todo.save().then((doc)=>{
        res.send(doc);
    }).catch((err)=>{
        res.status(400).send(err);
    });
});

app.get('/todos',(req,res)=>{
    Todo.find().then((todos)=>{
        res.send({todos});
    }).catch((err)=>{
        res.status(400).send(err);
    });
});

app.get('/todos/:id',(req,res)=>{
    let id = req.params.id;

    if(!ObjectID.isValid(id)){
       return res.status(404).send({});
    }
    Todo.findById({
        _id:id
    }).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }).catch((err)=>{
        res.status(400).send();
    });
});

app.delete('/todos/:id',(req,res)=>{
    //get id
    let id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Todo.findByIdAndRemove({
        _id:id
    }).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }).catch((err)=>{
        res.status(400).send();
    });

    //validate id -> not valid = 404

    //remove todo by id
        //success
            //if no doc, send 404 (null)
            //if doc, send back with 200
        //error
            //400 with empty body
})

app.listen(port, ()=>{
    console.log(`Started on port ${port}`);
});

module.exports = {app};