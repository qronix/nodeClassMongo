const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {User} = require('./../server/models/user');
const {Todo} = require('./../server/models/todo');

Todo.findOneAndRemove({_id: '5bbd2875b8ea339b70e848b6'}).then((todo)=>{
    
});

Todo.findById('5bbd2875b8ea339b70e848b6').then((todo)=>{
    console.log(`Removed document ${todo}`);
});
