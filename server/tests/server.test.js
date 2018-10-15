const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const{ObjectID} = require('mongodb');
const {todos,populateTodos,users,populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('PATCH /todos/:id',()=>{
    it('Should update the todo',(done)=>{
        //get id of first item
        //update text, set compeleted true
        //200
        //text is changed, completed is true, compeltedAt is a number .toBeA

        let id = todos[0]._id.toHexString();
        let text = "This is the new text...bitch.";
        // request(app)
        // .patch(`/todos/${id}`)
        // .send({"completed":true})
        // .expect(200)
        // .end((err,res)=>{
        //     if(err){
        //         return done(err);
        //     }
        //     Todo.findById(id).then((todo)=>{
        //         expect(todo.completed).toBe(true);
        //         expect(todo.completedAt).toBeA('number');
        //         expect(todo.text).toBe(text);
        //         done();
        //     }).catch((err)=>done(err));
        // });

        request(app)
        .patch(`/todos/${id}`)
        .send({
            completed: true,
            text
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(text);
            console.log(res.body);
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeA('number');
        })
        .end(done);
    });

    it('Should clear completedAt when todo is not completed', (done)=>{
        let id = todos[1]._id.toHexString();
        let text = "This is the new text again.....bitch.";

        // request(app)
        // .patch(`/todos/${id}`)
        // .send({"completed":false})
        // .expect(200)
        // .end((err,res)=>{
        //     if(err){
        //         return done(err);
        //     }
        //     Todo.findById(id).then((todo)=>{
        //         expect(todo.completed).toBe(false);
        //         expect(todo.completedAt).toNotExist();
        //         done();
        //     }).catch((err)=>done(err));
        // });

        request(app)
        .patch(`/todos/${id}`)
        .send({
            completed:false,
            text
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toNotExist();
            expect(res.body.todo.text).toBe(text);
        })
        .end(done);
    });
});

describe('GET /users/me',()=>{
    it('should return user if authenticated', (done)=>{
        request(app)
        .get(`/users/me`)
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });

    it('should return 401 if user is not authenticated',(done)=>{
        request(app)
        .get(`/users/me`)
        .expect(401)
        .expect((res)=>{
            expect(res.body).toEqual({})
        })
        .end(done);
    });
});

describe('POST /users',()=>{
    let password = 'sillypass!';
    let email = 'test@testys.com';

    it('should create a user',(done)=>{
        request(app)
        .post('/users')
        .send({
            email,
            password
        })
        .expect(200)
        .expect((res)=>{
            expect(res.headers['x-auth']).toExist();
            expect(res.body._id).toExist();
            expect(res.body.email).toBe(email);
        })
        .end((err)=>{
            User.findOne({email}).then((user)=>{
                expect(user).toExist();
                expect(user.password).toNotBe(password);
                done();
            });
        });
    });

    it('should return validation errors if request invalid',(done)=>{
        request(app)
        .post('/users')
        .send({
            email:"testsdasdasdasdas",
            password
        })
        .expect(400)
        .end(done);
    });

    it('should not create a user if email is in use',(done)=>{
        let {password} = users[0];
        let {email} = users[0];

        request(app)
        .post('/users')
        .send({
            email,
            password
        })
        .expect(400)
        .expect((res)=>{
            expect(res.body.errmsg).toExist().toBeA('string');
        })
        .end(done);
    });
});