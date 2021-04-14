const News = require('./News');

module.exports = function(router, database) {
  News(router, database);

  return router;
}