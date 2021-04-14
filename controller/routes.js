const News = require('./news');
const Auth = require('./auth');

module.exports = function(router, database) {
  News(router, database);
  Auth(router, database);

  return router;
};
