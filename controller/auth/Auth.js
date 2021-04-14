const Model = require('./Model');

module.exports = function(router, database) {
  const cluster = database.db("auth");
  const model = new Model(cluster);
  // model.setCluster(cluster);

  router.post('/login', model.login);
  router.post('/signin', model.signin);
  return router;
};