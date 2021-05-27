const ObjectID = require('mongodb').ObjectID;
const authMiddleware = require('../../middleware/auth');

module.exports = function(router, database) {
  const cluster = database.db("league");

  const routeOneNews = "/admin/:league/news/edit/:id";

  router.get("/get-all-news", (req, res) => {
    cluster.collection("news").find()
    .toArray((error, data) => {
      if (error) {
        res.status(500).send({error: "500 ошибка"});
        return
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
        return
      } else {
        res.status(200).send(data);
        return;
      }
    })
  });

  router.put(routeOneNews, (req, res) => {
    const details = { '_id': new ObjectID(req.params.id) };
    const body = { $set: req.body };

    cluster.collection("news").updateOne({'mainNews': true}, {$set: {'mainNews': false}}, (error, data) => {
      if(error) throw error;
    });
    cluster.collection("news").updateOne(details, body, (error, data) => {
      if (error) {
        res.status(500).send({error: "500 ошибка"});
      } else {
        res.status(200).send(data);
      }

      return;
    });
  });

  router.delete(routeOneNews, (req, res) => {
    cluster.collection("news").deleteOne({ '_id': new ObjectID(req.params.id) }, (error, data) => {
      if (error) {
        res.status(500).send({error: "500 ошибка"});
      } else {
        res.status(200).send(data);
      }

      return;
    });
  });

  router.post('/admin/news/create', (req, res) => {

    /*cluster.collection("news").updateOne({'mainNews': true}, {$set: {'mainNews': false}}, (error, data) => {
      if(error) throw error;
    });*/

    req.body.dateCreate = Date.now();

    cluster.collection("news").insertOne(req.body);
    res.status(200).json({ok: 1});

  });

  router.get('/main-news', (req, res) => {
    cluster.collection("news").findOne({mainNews: true}, (error, data) => {
      if(error) {
        res.status(500).send({error: "500 ошибка"});
        return;
      }
      res.status(200).json(data);
      return;
    })
  });

  router.get('/get-latest-news/:count', (req, res) => {
    cluster.collection("news").find({mainNews: false},{})
    .limit(+req.params.count).sort('dateCreate', -1)
    .toArray((error, data) => {
      if (error) {
        res.status(500).send({error: "500 ошибка"});
        return
      }
      res.status(200).send(data);

      return;
    });

  });

  router.post('/create-comment', [authMiddleware],(req, res) => {
    try {
      const {comments, newsId, comment, name} = req.body;
      const details = { '_id': new ObjectID(newsId) };
      comment.dateCreate = Date.now();
      // comment.name = name;
      // comment.logoUser = logoUser;
      // comment.subComments = subComments;
      comments.push(comment);
      console.log(22222);
      const body = { $set: {comments} };

      cluster.collection("news").updateOne(details, body, (error, data) => {
        console.log(333);
        if (error) {
          console.log(444);
          res.status(500).send({error: "500 ошибка"});
        } else {
          console.log(555);
          res.status(200).send(comments);
        }

        return;
      });
    } catch (e) {
      console.log('что то пошло не так в /create-comment', e);
    }

  });
};