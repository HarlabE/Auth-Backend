const express = require('express');
const { default: connectDb } = require('./src/config/db');
const app = express();
require('dotenv').config();
const morgan = require('morgan');
const userRoutes = require('./src/routes/user.route')

app.use(express.json());
app.use(morgan('dev'));

const port = process.env.PORT || 3000;

app.use('/api/users', userRoutes)

app.get('/', (req, res) => {
    res.send('Welcome To HarlabE Auth api');
});

app.listen(port, ()=>{
    
    connectDb();
    console.log(`Server is running on port ${port}`);
})