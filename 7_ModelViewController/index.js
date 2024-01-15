const express = require('express');
const {connectMongoDb} = require('./connection')

const {logReqRes} = require('./middlewares')

const userRouter = require('./routes/user')

const app = express();
const PORT = 8000;

// Connection
connectMongoDb('mongodb+srv://admin:admin@cluster0.en1paje.mongodb.net/?retryWrites=true&w=majority')
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log('Mongo Err', err));

// Middleware
app.use(express.urlencoded({ extended: false}));
app.use(logReqRes("log.txt"));

// Routes
app.use('/api/users', userRouter);


app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`))