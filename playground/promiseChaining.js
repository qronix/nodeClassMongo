var user = {
    speak: function(){
        return new Promise((resolve,reject)=>{
            resolve("Finished speaking!");
        })
    },
    walk:  function(){
        var food = {
            type:"Mexican"
        };
        return user.eat().then((msg)=>{
            console.log(msg);
            return food;
        });
    },
    eat:function(){
        return new Promise((resolve,reject)=>{
            resolve("done eating!");
        });
    }
};

user.speak().then((msg)=>{
    console.log(msg);
    return user.walk();
}).then((food)=>{
    console.dir(food);
    console.log(`My food is: ${food.type}`);
});

