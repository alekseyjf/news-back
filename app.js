'use strict';

const express = require("express");
const app = express();
const router = express.Router();
const config = require("config");
const mongodb = require("mongodb").MongoClient;
const routerModule = require("./controller/routes");

const cors = require('./middleware/cors');

const PORT = config.get("port");

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());

app.use(cors);


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

