const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {User} = require('./../server/models/user');
const {Todo} = require('./../server/models/todo');

var id = '5bb9473a5d380fa8a3eca412';

// if(!ObjectID.isValid(id)){
//     console.log('ID not valid!');
// }

// Todo.find({
//     _id: id
// }).then((todos)=>{
//     console.log(`Todos ${todos}`);
// });

// Todo.findOne({
//     _id: id
// }).then((todo)=>{
//     console.log(`Todo ${todo}`);
// });

// Todo.findById(id).then((todoById)=>{
//     if(!todoById){
//         return console.log('Id not found');
//     }
//     console.log(`Todo by Id ${todoById}`);
// }).catch((err)=>{
//     console.log(err);
// });

//find user
//handle user not found
//handle errors

User.findById({
    _id:id
}).then((user)=>{
    if(!user){
        return console.log('User was not found');
    }
    console.log(`User: ${user}`);
}).catch((err)=>{
    console.log(err);
});

