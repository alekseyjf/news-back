// const path = require('path');
// const fullPath = path.dirname(require.main.filename);

// const BaseModel = require(fullPath + '\\core\\BaseModel.js');

class Auth {
  constructor(cluster) {
    this.cluster = cluster;
    this.login = this.login.bind(this);
  }

  login = (req, res) => {
    const {name, email, password} = req.body;
    if(name && email && password) {
      this.cluster.collection("users").findOne({'email': email}, (error, data) => {
        if(error) {
          res.status(400).json({error: "Что то пошло не так"});
        }
        if(data === null) {
          this.cluster.collection("users").insertOne({name, email, password});
          res.status(200).json({ok: 1});
        } else {
          res.status(400).json({error: "Такой пользователь существует"});
        }
      });
    }

    // res.status(200).send(req.body);
    return;
  };

  signin = (req, res) => {
    const {name, email, password} = req.body;
    console.log(req.body);

    this.cluster.collection("users").findOne({'email': email}, (error, data) => {
      console.log(data === null);
      if(error || data === null) {
        res.status(400).send({error: "Нет такого пользователя"});
      } else {
        const {name, email} = data;
        res.status(200).send({name, email});
      }
    });

    // res.status(200).send(req.body);
    return;
  }

}

module.exports = Auth;
