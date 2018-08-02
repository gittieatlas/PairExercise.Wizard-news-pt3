const express = require('express');
const client = require('../db');
const postList = require('../views/postList');
const postDetails = require('../views/postDetails');
const addPost = require('../views/addPost');

const router = express.Router();
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

router.post('/', async (req, res) => {
  const name = req.body.name;
  const title = req.body.title;
  const content = req.body.content;

  // Insert the post in the database

  // 'INSERT INTO posts (userid, title, content) VALUES ('14', 'test', 'content')

  res.redirect(`/posts/${postId}`); // Redirect to the post details page
});

module.exports = router;
