const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  console.log(req.method);
  if(req.method === "OPTION") {
    next();
    return;
  }
  console.log(req.headers);
  try {
    const accessToken = req.headers.authorization.split(' ')[1];
    if(!accessToken) {
      res.status(403).json({message: '1Пользователь не зарегестрирован'});
      return;
    }
    console.log(111111111, accessToken );
    const deckodeData = jwt.decode(accessToken, config.sectretKeyAccessToken);
    req.user = deckodeData;

    console.log('user1', deckodeData);

    jwt.verify(accessToken, config.sectretKeyAccessToken, (err, user) => {
      if (err) {
        res.status(419).send({error: 'Токен не верефицирован', status: 419});
        return;
      }
      console.log('user2', user);
      req.user = user;
      next();
    });

    // next();

  } catch (e) {
    console.log(e);
    res.status(403).json({message: '2Пользователь не зарегестрирован'});
    return;
  }
  return;
};