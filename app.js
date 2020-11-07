'use strict';

const express = require("express");
const app = express();
const router = express.Router();
const config = require("config");
const mongodb = require("mongodb").MongoClient;
const routerModule = require("./controller/routes");

const PORT = config.get("port");

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());

app.use((req, res, next) => {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});


async function start() {
  try {
    await mongodb.connect(config.get('mongoUrl'), {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, (err, database) => {

      if(err) console.log(err);

     app.use(routerModule(router, database));

    });

    app.listen(PORT, () => console.log(`app has been started on port: ${PORT}`))
  } catch(e) {
    console.log("Server Error", e.message)
    process.exit(1)
  }
}

start();

