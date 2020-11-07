const ObjectID = require('mongodb').ObjectID;

module.exports = function(router, database) {
  const cluster = database.db("league");

  const routeOneNews = "/admin/:league/news/edit/:id";

  router.get("/get-all-news", (req, res) => {
    console.log(1);
    cluster.collection("news").find()
    .toArray((error, data) => {
      if (error) {
        res.status(500).send({error: "500 ошибка"});
        throw error
      } else {
        res.status(200).send(data);
        return;
      }
    });
  });

  router.get(routeOneNews, (req, res) => {
    cluster.collection("news").findOne({ '_id': new ObjectID(req.params.id)}, (error, data) => {
      if (error) {
        res.status(500).send({error: "500 ошибка"});
        throw error
      } else {
        res.status(200).send(data);
        return;
      }
    })
  });

  router.put(routeOneNews, (req, res) => {
    const details = { '_id': new ObjectID(req.params.id) };
    const body = { $set: req.body };
    console.log('mainNews');

    cluster.collection("news").updateOne({'mainNews': true}, {$set: {'mainNews': false}}, (error, data) => {
      if(error) throw error;
    });
    cluster.collection("news").updateOne(details, body, (error, data) => {
      if (error) {
        res.status(500).send({error: "500 ошибка"});
        throw error
      } else {
        res.status(200).send(data);
        return;
      }
    });
  });

  router.delete(routeOneNews, (req, res) => {
    console.log("router delete");
    cluster.collection("news").deleteOne({ '_id': new ObjectID(req.params.id) }, (error, data) => {
      if (error) {
        res.status(500).send({error: "500 ошибка"});
        throw error
      } else {
        res.status(200).send(data);
        return;
      }
    });
  });

  router.post('/admin/news/create', (req, res) => {

    req.body.dateCreate = Date.now();
    // console.log(req.body);

    cluster.collection("news").insertOne(req.body);
    res.status(200).json({ok: 1});

  });

  router.get('/main-news', (req, res) => {
    cluster.collection("news").findOne({mainNews: true}, (error, data) => {
      if(error) {
        res.status(500).send({error: "500 ошибка"});
        throw error
      }

      res.status(200).json(data)
    })
  });

  router.get('/get-latest-news/:count', (req, res) => {
    cluster.collection("news").find({mainNews: false},{})
    .limit(+req.params.count).sort('dateCreate', -1)
    .toArray((error, data) => {
      if (error) {
        res.status(500).send({error: "500 ошибка"});
        throw error
      }
      // console.log(data);
      res.status(200).send(data);

      return;
    });

  });

  return router;
};