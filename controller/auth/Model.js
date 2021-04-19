const bcrypt = require('bcrypt');
const saltRounds = 7;
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('../../config/default.json');

const generateAccessTokken = (id, roles = 'user') =>  {
  const payload = {
    id, roles
  };

  return jwt.sign(payload, config.sectretKey, {expiriesIn: '24h'})
};

class Auth {
  constructor(cluster) {
    this.cluster = cluster;
    this.login = this.login.bind(this);
  }

  login = (req, res) => {
    const error = validationResult(req);
    console.log(error);
    if(!error.isEmpty()) {
      return res.status(400).json({message: 'произошла ошибка при регистрации', error});
    }

    const {name, email, password} = req.body;
    if(name && email && password) {
      this.cluster.collection("users").findOne({'email': email}, (error, data) => {
        if(error) {
          res.status(400).json({error: "Что то пошло не так"});
          return;
        }
        if(data === null) {
          const hashPassword = bcrypt.hashSync(password, saltRounds);

          this.cluster.collection("users").insertOne({name, email, password: hashPassword});

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
        const {name: userName, email: userEmail, password: userPass} = data;

        const validPassword = bcrypt.compareSync(password, userPass);
        console.log(validPassword);

        if(!validPassword) {
          res.status(400).send({error: "Пароль не валиден"});
          return;
        }

        const tokken = generateAccessTokken(data.id);

        res.status(200).send({name: userName, email: userEmail});
      }
    });

    // res.status(200).send(req.body);
    return;
  }

}

module.exports = Auth;
