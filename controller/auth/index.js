const Auth = require('./Auth');

module.exports = function(router, database) {
  Auth(router, database);

  return router;
}