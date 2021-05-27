const bcrypt = require('bcrypt');
const saltRounds = 7;
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('../../config/default');

let refreshTokens = [];

const generateToken = (id, time = null, role = 'user') => {
  const payload = {
    id, role
  };

  return time ?
    jwt.sign(payload, config.sectretKeyAccessToken, {expiresIn: time})
    : jwt.sign(payload, config.sectretKeyRefreshToken);
};

class Auth {
  constructor(cluster) {
    this.cluster = cluster;
  }

  signup = (req, res) => {
    try {
      const error = validationResult(req);
      console.log(error);
      if (!error.isEmpty()) {
        return res.status(400).json({message: 'произошла ошибка при регистрации', error});
      }

      const {name, email, password} = req.body;
      if (name && email && password) {
        this.cluster.collection("users").findOne({'email': email}, (error, data) => {
          if (error) {
            res.status(400).json({error: "Что то пошло не так"});
            return;
          }
          if (data === null) {
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
    } catch (e) {
      console.log(e);
    }
  };

  signin = (req, res) => {
    try {
      console.log('user', req.user);
      const {name, email, password} = req.body;
      console.log('body', req.body);

      this.cluster.collection("users").findOne({'email': email}, (error, data) => {
        console.log(1, data === null);

        if (error || data === null) {
          res.status(400).send({error: "Нет такого пользователя"});

        } else {
          const {name: userName, email: userEmail, password: userPass} = data;

          console.log(2, data._id);
          const accessToken = generateToken(data._id, '1m');
          const refreshToken = generateToken(data._id);
          refreshTokens.push(refreshToken);
          console.log(3, accessToken);

          const validPassword = bcrypt.compareSync(password, userPass);
          console.log(4, validPassword);

          if (!validPassword) {
            res.status(400).send({error: "Пароль не валиден"});
            return;
          }

          res.status(200).send({name: userName, email: userEmail, accessToken, refreshToken});
        }
      });

      // res.status(200).send(req.body);
      return;
    } catch (e) {
      console.log(e);
    }
  };

  accessToken = (req, res) => {
    const {accessToken} = req.body;

    if (!accessToken) {
      return res.status(401).send({error: 'Не авторизирован'});
    }

    if (!refreshTokens.includes(accessToken)) {
      return res.status(403).send({error: "403 ошибка Токен протух"});
    }

    jwt.verify(accessToken, config.sectretKeyAccessToken, (err, user) => {
      if (err) {
        return res.status(403).send({error: "403 ошибка Токен не прошел проверку на валидность"});
      }

      const newsAccessToken = generateToken(user._id, '20m');

      res.json({
        accessToken: newsAccessToken
      });
    });
  };

  logout = (req, res) => {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter(t => t !== token);

    res.status(200).send({message: 'Logout successful'});
  }

}

module.exports = Auth;
