require('dotenv').config();

const express = require('express');      // requiring express and creating an instance of it
const app = express();


const { connectToMongoDB } = require('./connect');      //connecting to the database

connectToMongoDB(process.env.MONGO_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error(err));



const urlRoute = require('./routes/router');        //   requiring the router file  which contains the routes

const Schema = require('./models/notesSchema');             // requiring the schema from the models folder

const PORT = process.env.PORT || 5050 ;

// Middleware
app.use(express.urlencoded({ extended: true }));  
app.use(express.json());  

app.use('/user', urlRoute);


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
