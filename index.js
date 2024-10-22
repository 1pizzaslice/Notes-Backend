require('dotenv').config();

const express = require('express');      // requiring express and creating an instance of it
const app = express();
const cookieParser = require("cookie-parser");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");
const cors = require('cors'); 
const { connectToMongoDB } = require('./connect');      //connecting to the database
const uploadRoute = require('./routes/upload'); 

connectToMongoDB(process.env.MONGO_URL)    // process.env.MONGO_URL
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error(err));

    app.use(cors({
        origin: function (origin, callback) {
            
            if (!origin || origin) {
                callback(null, origin); // allow all origins
            } else {
                callback(new Error('CORS error: Origin not allowed'));
            }
        },
        credentials: true, 
    }));

const urlRoute = require('./routes/router');        
const userRoute = require('./routes/user');        

const Schema = require('./models/notesSchema');             // requiring the schema from the models folder

const PORT = process.env.PORT || 5050 ;

// Middleware
app.use(express.urlencoded({ extended: true }));  
app.use(express.json()); 
app.use(cookieParser()); 
app.use('/uploads', express.static('uploads'));  // serve the uploads folder

app.use('/user', userRoute);
app.use('/', restrictToLoggedinUserOnly ,urlRoute);
app.use('/uploads', uploadRoute); 


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
