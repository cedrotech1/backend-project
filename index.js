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
    db.query("INSERT INTO car (type, Model, MechanicName) VALUES (?,?,?)", [type, Model, MechanicName], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error adding car' });
        } else {
            res.json({ message: 'Car added successfully', result });
        }
    });    
})
// select cars api
app.get('/display-cars',(req,res)=>{
    
    db.query("select * from car", (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error fetching cars' });
        } else {
            res.json(result);
        }
    });  
})
// delete car api
app.delete('/delete-car',(req,res)=>{
    let {PlateNumber} = req.body;
    db.query("delete from car where PlateNumber=?", [PlateNumber], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error deleting car' });
        } else {
            res.json({ message: 'Car deleted successfully', result });
        }
    }); 
})

app.put('/edit-car',(req,res)=>{
    let {PlateNumber,type, Model, MechanicName} = req.body;
    db.query("update  car set type=?,Model=?,MechanicName=? where PlateNumber=?", [type, Model, MechanicName,PlateNumber], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error updating car' });
        } else {
            res.json({ message: 'Car updated successfully', result });
        }
    });

    
})
// Services APIs
app.post('/add-service', (req, res) => {
    let { ServiceName, ServicePrice } = req.body;
    db.query("INSERT INTO services (ServiceName, ServicePrice) VALUES (?, ?)", [ServiceName, ServicePrice], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error adding service' });
        } else {
            res.json({ message: 'Service added successfully', result });
        }
    });
});

app.get('/display-services', (req, res) => {
    db.query("SELECT * FROM services", (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error fetching services' });
        } else {
            res.json(result);
        }
    });
});

// Payment APIs
app.post('/add-payment', (req, res) => {
    let { AmountPaid, PaymentDate, ServiceCode, PlateNumber } = req.body;
    db.query("INSERT INTO payment (AmountPaid, PaymentDate, ServiceCode, PlateNumber) VALUES (?, ?, ?, ?)", 
    [AmountPaid, PaymentDate, ServiceCode, PlateNumber], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error adding payment' });
        } else {
            res.json({ message: 'Payment added successfully', result });
        }
    });
});

app.get('/display-payments', (req, res) => {
    db.query("SELECT * FROM payment", (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error fetching payments' });
        } else {
            res.json(result);
        }
    });
});

// Service Record APIs with full CRUD
app.post('/add-service-record', (req, res) => {
    let { SeviceDate } = req.body;
    db.query("INSERT INTO servicerecord (SeviceDate) VALUES (?)", 
    [SeviceDate], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error adding service record' });
        } else {
            res.json({ message: 'Service record added successfully', result });
        }
    });
});

app.get('/display-service-records', (req, res) => {
    db.query("SELECT * FROM servicerecord", (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error fetching service records' });
        } else {
            res.json(result);
        }
    });
});

app.put('/update-service-record', (req, res) => {
    let { RecordNumber, SeviceDate } = req.body;
    db.query("UPDATE servicerecord SET SeviceDate = ? WHERE RecordNumber = ?", 
    [SeviceDate, RecordNumber], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error updating service record' });
        } else {
            res.json({ message: 'Service record updated successfully', result });
        }
    });
});

app.delete('/delete-service-record', (req, res) => {
    let { RecordNumber } = req.body;
    db.query("DELETE FROM servicerecord WHERE RecordNumber = ?", [RecordNumber], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error deleting service record' });
        } else {
            res.json({ message: 'Service record deleted successfully', result });
        }
    });
});

// Reports APIs
app.get('/daily-report/:date', (req, res) => {
    let date = req.params.date;
    db.query(`SELECT sr.RecordNumber, sr.SeviceDate, c.PlateNumber, c.type, c.Model, 
             s.ServiceName, s.ServicePrice, p.AmountPaid, p.PaymentDate
             FROM servicerecord sr
             LEFT JOIN car c ON sr.PlateNumber = c.PlateNumber
             LEFT JOIN services s ON sr.ServiceCode = s.ServiceCode
             LEFT JOIN payment p ON sr.ServiceCode = p.ServiceCode AND sr.PlateNumber = p.PlateNumber
             WHERE sr.SeviceDate = ?`, [date], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error generating daily report' });
        } else {
            res.json(result);
        }
    });
});

app.get('/generate-bill/:plateNumber', (req, res) => {
    let plateNumber = req.params.plateNumber;
    db.query(`SELECT c.PlateNumber, c.type, c.Model, c.MechanicName,
             sr.RecordNumber, sr.SeviceDate, s.ServiceName, s.ServicePrice,
             p.AmountPaid, p.PaymentDate, u.names as receiver
             FROM car c
             LEFT JOIN servicerecord sr ON c.PlateNumber = sr.PlateNumber
             LEFT JOIN services s ON sr.ServiceCode = s.ServiceCode
             LEFT JOIN payment p ON sr.ServiceCode = p.ServiceCode AND sr.PlateNumber = p.PlateNumber
             LEFT JOIN users u ON 1=1
             WHERE c.PlateNumber = ?`, [plateNumber], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error generating bill' });
        } else {
            res.json(result);
        }
    });
});

app.get('/total-revenue/:date', (req, res) => {
    let date = req.params.date;
    db.query(`SELECT SUM(p.AmountPaid) as totalRevenue, COUNT(*) as totalServices
             FROM payment p
             WHERE p.PaymentDate = ?`, [date], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error calculating total revenue' });
        } else {
            res.json(result[0]);
        }
    });
});

// signup
app.post("/signup",(req,res)=>{
    let {names,email,password} = req.body;
    let hashedpassword = bcrypt.hashSync(password,10);
    db.query("select * from users where email=?", [email], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error checking if user exists' });
        } else {
            if (result.length > 0) {
                res.json({ message: 'User already exists' });
            } else {    

                db.query("insert into users (names, email, password) values(?,?,?)",[names,email,hashedpassword],(err,result)=>{
                    if(err){
                        console.error(err);
                        res.status(500).json({ error: 'Error signing up' });
                    }else{
                        res.json({message:"User registered successfully",result})
                    }
                })
            }
        }
    })
})
// login
app.post("/login",(req,res)=>{
    let {email,password} = req.body;
    db.query("select * from users where email=?", [email], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error logging in' });
        } else {
            if(result.length === 1){
                // well find
                let userpassord=result[0].password;
                let isvalidpassword = bcrypt.compareSync(password, userpassord);
                if(isvalidpassword===true){
                    let token = jwt.sign({result}, 'secret');
                    res.json(
                        {
                        message:"Login successful",
                        token:token,
                        user:result[0]
                    });
                }else{
                    res.status(401).json({message:"Invalid password"});
                }
                      
            }else{
                res.status(404).json({message:"User not found"});
            }
        }
    });
});




app.get('/hello',(req,res)=>{
    res.send('Hello World!');
})



app.listen(4000,()=>{console.log("Server is running on port 4000")})