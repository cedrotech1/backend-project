const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');

app.use(cors({ origin: '*' }));

const db = require('./connection');
// const port = 3000;
// middleware
app.use(express.json());

// add cars api
app.post('/add-car',(req,res)=>{
    let {type, Model, MechanicName} = req.body;
    db.query("INSERT INTO car VALUES ('',?,?,?)", [type, Model, MechanicName], (err, result) => {
        if (err) {
            console.error(err);
            res.send('Error adding car');
        } else {
            res.send('Car added successfully');
        }
    });    
})
// select cars api
app.get('/display-cars',(req,res)=>{
    
    db.query("select * from car", (err, result) => {
        if (err) {
            console.error(err);
            res.send('Error adding car');
        } else {
            res.send(result);
        }
    });  
})
// delete
// add cars api
app.delete('/delete-car',(req,res)=>{
    let {PlateNumber} = req.body;
    connection.query("delete from car where PlateNumber=?", [PlateNumber], (err, result) => {
        if (err) {
            console.error(err);
            res.send('Error adding car');
        } else {
            res.send('Car deleted successfully');
        }
    }); 
})

app.put('/edit-car',(req,res)=>{
    let {PlateNumber,type, Model, MechanicName} = req.body;
    db.query("update  car set type=?,Model=?,MechanicName=? where PlateNumber=?", [type, Model, MechanicName,PlateNumber], (err, result) => {
        if (err) {
            console.error(err);
            res.send('Error adding car');
        } else {
            res.send('Car updated successfully');
        }
    });

    
})
// api add service record
app.post("/saving-services",(req,res)=>{
    let SeviceDate=req.body.SeviceDate;
db.query("insert into servicerecord values('',?)",[SeviceDate],(err,result)=>{
    if(err){
        res.send(err)
    }else{  
        
        res.send({message:"well done",result})
    }
})

})

// signup
app.post("/signup",(req,res)=>{
    let {names,email,password} = req.body;
    let hashedpassword = bcrypt.hashSync(password,10);
db.query("insert into users values('',?,?,?)",[names,email,hashedpassword],(err,result)=>{
    if(err){
        res.send(err)
    }else{
        res.send({message:"well done",result})
    }
})
})
// login
app.post("/login",(req,res)=>{
    let {email,password} = req.body;
    db.query("select * from users where email=?", [email], (err, result) => {
        if (err) {
            console.error(err);
            res.send('Error logging in');
        } else {
            if(result.length === 1){
                // well find
                let userpassord=result[0].password;
                let isvalidpassword = bcrypt.compareSync(password, userpassord);
                if(isvalidpassword===true){
                    let token = jwt.sign({result}, 'secret');
                    res.send(
                        {
                        message:"Login successful",
                        token:token,
                        user:result[0]
                    });
                }else{
                    res.send({message:"Invalid password"});
                }
                      
            }else{
                res.send({message:"User not found"});
            }
        }
    });
});




app.get('/hello',(req,res)=>{
    res.send('Hello World!');
})



app.listen(4000,()=>{console.log("Server is running on port 4000")})