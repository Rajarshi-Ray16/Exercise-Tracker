const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const PORT = 4000;
const DB_NAME = "exercise_tracker"

var UserRouter = require("./routes/Users");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage, });

// Connection to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/' + DB_NAME, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully !");
})

app.use("/user", UserRouter);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});