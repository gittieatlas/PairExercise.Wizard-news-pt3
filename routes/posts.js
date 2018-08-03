const router = require('express').Router();
const client = require('../db');
const SQL = require('sql-template-strings');
const postList = require('../views/postList');
const postDetails = require('../views/postDetails');
const addPost = require('../views/addPost');

const baseQuery =
  'SELECT posts.*, users.name, counting.upvotes FROM posts INNER JOIN users ON users.id = posts.userId LEFT JOIN (SELECT postId, COUNT(*) as upvotes FROM upvotes GROUP BY postId) AS counting ON posts.id = counting.postId\n';

router.get('/', async (req, res, next) => {
  console.log('in /');

  try {
    const data = await client.query(baseQuery);
    res.send(postList(data.rows));
  } catch (error) {
    next(error);
  }
});

// DONT MOVE THIS OUT OF ORDER
router.get('/add', (req, res) => {
  console.log('in /add');
  console.log(req.body);

  res.send(addPost());
});

router.get('/:id', async (req, res, next) => {
  console.log('in /id');
  try {
    const data = await client.query(baseQuery + 'WHERE posts.id = $1', [
      req.params.id
    ]);
    const post = data.rows[0];
    res.send(postDetails(post));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  console.log('in / of POST');

  const name = req.body.name;
  const title = req.body.title;
  const content = req.body.content;

  try {
    let userData = await client.query(
      'SELECT * FROM users WHERE users.name = $1',
      [name]
    );
    if (!userData.rows.length) {
      userData = await client.query(
        'INSERT INTO users (name) VALUES  ($1) RETURNING *',
        [name]
      );
    }

    const userId = userData.rows[0].id;
    const postData = await client.query(
      SQL`INSERT INTO posts (userid, title, content)
          VALUES (  ${userId},
                    ${title},
                    ${content} )
          RETURNING *`
    );
    const postId = postData.rows[0].id;
    const upvotesData = await client.query(
      SQL`INSERT INTO upvotes (userId, postId) VALUES (${userId}, ${postId}) RETURNING *`
    );
    res.redirect(`/posts/${postId}`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
