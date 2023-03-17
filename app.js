const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitization = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require('cors');
const fileUpload = require('express-fileupload');
const app = express();
app.use(express.static('public'));

// const auth = require("./routes/auth");
// const AppError = require("./utils/appError");
// const globalErrorHandler = require("./controllers/errorController");
// const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const projectRouter = require('./routes/projectRoutes');
const adminCommonRouter = require('./routes/adminCommonRoutes');
// const reviewRouter = require("./routes/reviewRoutes");

//set security HTTP headers
app.use(helmet());
const corsOrigin ={
  origin:['http://localhost:8080','https://navigatorbd.com'], //or whatever port your frontend is using
  // origin:'https://navigatorbd.com', //or whatever port your frontend is using
  credentials:true,
  optionSuccessStatus:200
}
app.use(cors(corsOrigin));

//Develoment Loging
if (process.env.NODE_ENV == "developement") {
  app.use(morgan("dev"));
}
app.use(fileUpload({
  useTempFiles: true
}));

app.use(express.urlencoded({ extended: false }));
//Limit requests from same API
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, Please try againin an hour!",
});
app.use("/api", limiter);

//Body Parser, rading data form body into req.body
app.use(express.json({ limit: "100kb" }));

//Data sanitization against NoSQL query injection
app.use(mongoSanitization());
//Data sanitization against xss
app.use(xss());
// Prevent parameter pollution
// app.use(bodyParser.json())
app.use(
  hpp({
    whitelist: ["duration"],
  })
);

// route register here
// app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/admin-common", adminCommonRouter);

// app.use(globalErrorHandler);

module.exports = app;
