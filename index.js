require('dotenv').config();

const express = require('express');      // requiring express and creating an instance of it
const app = express();
const cookieParser = require("cookie-parser");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");

const { connectToMongoDB } = require('./connect');      //connecting to the database

connectToMongoDB(process.env.MONGO_URL)    // process.env.MONGO_URL
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error(err));



const urlRoute = require('./routes/router');        
const userRoute = require('./routes/user');        

const Schema = require('./models/notesSchema');             // requiring the schema from the models folder

const PORT = process.env.PORT || 5050 ;

// Middleware
app.use(express.urlencoded({ extended: true }));  
app.use(express.json()); 
app.use(cookieParser()); 

app.use('/user', userRoute);
app.use('/', restrictToLoggedinUserOnly ,urlRoute);


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
