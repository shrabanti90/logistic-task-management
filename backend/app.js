const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
const logger = require("morgan");
const path = require("path");
const chalk = require("chalk");
const errorHandler = require("errorhandler");
const lusca = require("lusca");
const dotenv = require("dotenv"); 
const cors = require("cors");

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
if (process.env.NODE_ENV === "test") {
  dotenv.load({ path: `${__dirname}/.test.env` });
} else {
  dotenv.load({ path: ".env" });
}

/**
 * Create Express server.
 */
const app = express();



// GZIP compress resources served
app.use(compression());

app.use(cors());

/**
 * Start Express server.
 */
app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), () => {
  console.log(
    "%s App is running at http://localhost:%d in %s mode",
    chalk.green("✓"),
    app.get("port"),
    app.get("env")
  );
  console.log("Press CTRL-C to stop\n");
});

/**
 * Express configuration.
 */
if (process.env.NODE_ENV !== "test") {
  app.use(logger("dev"));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.disable("x-powered-by");

app.use(
  "/",
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);
// view engine setup
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'pug');

// application specific logging, throwing an error, or other logic here
process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
});
app.use((req, res, next) => {
    if (process.env.NODE_ENV === "development") {
        console.log("req body", req.body);
        console.log("req query", req.query);
        // console.log("authorization", req.headers);
  }
    next();
});
// Routes
const indexRouter = require("./routes/index");

app.use("/", indexRouter);

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === "development") {
  app.use(errorHandler());
}

module.exports = app;
