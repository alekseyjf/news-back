const Model = require('./Model');
const { check } = require('express-validator');

module.exports = function(router, database) {
  const cluster = database.db("auth");
  const model = new Model(cluster);
  // model.setCluster(cluster);

  const arrMiddlware = [
    check('name', 'Имя пользователя не может быть пустым').notEmpty(),
    check('email', 'Проверьте корректно ли вы ввели пароль').normalizeEmail().isEmail().notEmpty(),
    check('password', 'Пароль должен быть больше 4-х символов и не больше 20-и').isLength({min: 4, max: 20})
  ];

  router.post('/access-token', model.accessToken);
  router.post('/signup', arrMiddlware, model.signup);
  router.post('/signin', arrMiddlware, model.signin);
  router.post('/logout', model.logout);



  return router;
};