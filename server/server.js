const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const path = require("path");
const PORT = 3000;
const apiRouter = require("./routes/api");
const cookieController = require('../server/controllers/cookieController');



app = express();

//utilization of cors
app.use(cors());
//invoke cookieParser to handle cookies
app.use(cookieParser());

//make all requests to the backend json
app.use(express.json());

//url encode requests to the backend so they are usable
//add the extended option because body-parser is depreciated
app.use(express.urlencoded({
  extended: true
}));


const MONGO_URI = 'mongodb+srv://test1234:12345@cluster0.bas8bvo.mongodb.net/?retryWrites=true&w=majority'

// Server/database initilization
mongoose.set('strictQuery', true);

//connect to Mongoose d
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to database ✅');
    // Start the server on port 3000
    app.listen(PORT, () => {
      console.log(`Server is listening at http://localhost:${PORT}/ ✅`);
    });
  })
  .catch((e) => console.log(`🛑 Failed to start server: ${e}`));


//invoke the use method on the server and ensuring everything with base endpoint has avaiability to the contents within the client folder

//Landing page/introduction - login
//? potential resource https://stackoverflow.com/questions/31622394/nodejs-express-served-html-file-not-loading-js-file



app.get("/", cookieController.setCookie,(req, res) => {

  res.status(200).sendFile(path.join(__dirname, "../client/login.html"));
});



//! Route hanlder for controllers and moving around the application
app.use("/", apiRouter);

//! The following makes the client folder "public" and therefore allows the JS to run
app.use('/',express.static('client'));


/**
 * main application
 */
app.get("/app", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "../client/index.html"));
});

/**
 * signup
 */

app.get("/signup", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "../client/signup.html"));
});


/**
 * 404 handler if an incorrect route is used
 */
app.use("*", (req, res) => {
  res.status(404).sendFile(path.resolve(__dirname, "../client/404.html"));
});

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 400,
    message: { err: "An error occurred" },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});
