require('./lib/db');
require('dotenv').config();
const express = require('express');
logger = require('morgan');
const app = express();
// const userRoute = require('./routes/user-route');
// const productRouter = require('./routes/products');


//middleware
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// //api routes
// app.use('/v1', userRoute);
// app.use('/v2', productRouter);

app.use(function (error, req, res, next) {

  // set locals, only providing error in development
  res.locals.message = error.message;
  res.locals.error = req.app.get("env") === "development" ? error : {};
  console.log(error);
  // render the error page
  if (!error.code) {
    return res.status(500).json({
      message: error.message || "Error processing request",
      status: false,
      data: null,
    });
  }
  return res.status(error.code).json({
    message: error.message,
    status: false,
    data: null,
  });
});


//server
app.listen(process.env.PORT, _ => {
    console.log(`Server running on PORT ${ process.env.PORT } `);
});
if (err => {
        console.log(`Error connecting to MongoDB: ${ err }`);
    });