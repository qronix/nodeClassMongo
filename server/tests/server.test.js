const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const{ObjectID} = require('mongodb');

const todos = [{
    _id: new ObjectID(),
    text:"First test todo"
},{
    text:"Second test todo",
    _id: new ObjectID()
}];

beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    }).then(()=>done());
});

describe('POST /todos',()=>{
    it('should create a new todo', (done)=>{
        var text = "Test todo text";

        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res)=>{
           expect(res.body.text).toBe(text);
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }

            Todo.find({text}).then((todos)=>{
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((err)=>{
                done(err);
            });
        });
    });
    it('should not create a todo with invalid data',(done)=>{
        //send empty data
        //expect a 400
        //check for errors
        //verify the database does not contain any documents
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err,res)=>{
            if(err){
                return done(err);
            }

            Todo.find().then((todos)=>{
                expect(todos.length).toBe(2);
                done();
            }).catch((err)=>{
                done(err);
            });
        });
    });
});

describe('GET /todos',()=>{
    it('Should get all todos', (done)=>{
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });
});

// describe('GET /todos:id',()=>{
//     it('Should get the test todo with correct id',(done)=>{
//         //get test todo id
//         let testTodoId = 0;
//         let text = "First test todo";
//        Todo.findOne({
//             text
//         }).then((todo)=>
//         {
//             testTodoId=todo._id;
//             if(testTodoId !== 0){
//                 request(app)
//                 .get(`/todos/${testTodoId}`)
//                 .expect(200)
//                 .expect((res)=>{
//                     expect(res.body.todo.text).toBe(text);
//                     done();
//                 }).end((err)=>{
//                     if(err){
//                         return done(err);
//                     }
//                 });
//             }else{
//                 throw new Error('Invalid test todo id!');
//             }
//         }).catch((err)=>{
//             return done(err);
//         });
//     });
// });

describe('GET /todos/:id', ()=>{
    it('Should return todo doc', (done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('Should return 404 if todo not found',(done)=>{
        let hexId = new ObjectID().toHexString();
        request(app)
        .get(`/todos/${hexId}`)
        .expect(404)
        .end(done);
    });

    it('Should return 404 for non-object ids',(done)=>{
        request(app)
        .get(`/todos/231`)
        .expect(404)
        .end(done);
    });
});

describe('DELETE /todos/:id',()=>{
    it('Should remove a todo', (done)=>{
        var hexId = todos[1]._id.toHexString();

        request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo._id).toBe(hexId);
        }).end((err,res)=>{
            if(err){
                return done(err);
            }
            Todo.findById(hexId).then((todo)=>{
                expect(todo).toNotExist();
                done();
            }).catch((err)=>done(err));
        });
    });

    it('Should return a 404 if todo not found', (done)=>{
        let badID = new ObjectID().toHexString()+1;
        request(app)
        .delete(`/todos/${badID}`)
        .expect(404)
        .end(done);
    });

    it('Should return a 404 if object id is invalid',(done)=>{
        request(app)
        .delete(`/todos/23333`)
        .expect(404)
        .end(done);
    });
});