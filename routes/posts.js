const express = require('express');
const client = require("../db");
const postList = require("../views/postList");
const postDetails = require("../views/postDetails");

const router = express.Router();
const baseQuery = "SELECT posts.*, users.name, counting.upvotes FROM posts INNER JOIN users ON users.id = posts.userId LEFT JOIN (SELECT postId, COUNT(*) as upvotes FROM upvotes GROUP BY postId) AS counting ON posts.id = counting.postId\n";


router.get("/", async (req, res, next) => {
  try {
    const data = await client.query(baseQuery);
    res.send(postList(data.rows));
  } catch (error) { next(error) }
});

router.get("/:id", async (req, res, next) => {
	console.log('postid test')
  try {
    const data = await client.query(baseQuery + "WHERE posts.id = $1", [req.params.id]);
    const post = data.rows[0];
    res.send(postDetails(post));
  } catch (error) { next(error) }
});

module.exports = router;