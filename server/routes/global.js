const express = require("express");
const db = require("../db");

const router = express.Router();

//---------------------- Get Post/Article Info ----------------------

router.get("/get-articles", (req, res) => {
    const query = `SELECT * FROM posts_articles WHERE type = 'article'`;
    db.query(query, (err, articles) => {
        if (err) {
            return res.status(500).json(err.message);
        }
        if (articles.length === 0) {
            return res.status(404).json('No  articles found.');
        }
        res.status(200).json(articles);
    });
});

//---------------------- Get BlogPosts----------------------

router.get("/get-posts", (req, res) => {
    const query = `SELECT * FROM posts_articles WHERE type = 'post'`;
    db.query(query, (err, posts) => {
        if (err) {
            return res.status(500).json(err.message);
        }
        if (posts.length === 0) {
            return res.status(404).json('No  posts found.');
        }
        res.status(200).json(posts);
    });
});

//---------------------- Get Post/Article Info ----------------------

router.get("/get-post-article/:id", (req, res) => {
    const postArticleId = req.params.id;
    const query = `SELECT * FROM posts_articles WHERE item_id = ?`;
    db.query(query, [postArticleId], (err, items) => {
        if (err) {
            return res.status(500).json(err.message);
        }
        if (items.length === 0) {
            return res.status(404).json('No item found.');
        }
        res.status(200).json(items[0]);
    });
});

module.exports = router;

