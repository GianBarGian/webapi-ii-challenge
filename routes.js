const express = require('express');
const db = require('./data/db');

const routes = express.Router();

routes.use(express.json());

routes.get('/', (req, res) => {
    res.send(`
      <h2>Lambda Hubs API</h2>
      <p>Welcome to the Lambda Hubs API</p>
    `);
  });

routes.get('/api/posts', (req, res) => {
    db.find()
        .then(posts => {
            res.json(posts);
        })
        .catch(err => {
            res
                .status(500)
                .json({ error: "The posts information could not be retrieved." });
        });
})

routes.get('/api/posts/:id', (req, res) => {
    const { id } = req.params;  
    db.findById(id)
        .then(post => {
            post.length
            ? res.json(post)
            : res
                .status(404)
                .json({ message: "The post with the specified ID does not exist." });
        })
        .catch(err => {
            res
                .status(500)
                .json({ error: "The post information could not be retrieved." });
        })
})

routes.delete('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    db.findById(id)
        .then(post => {
            post.length
            ? db.remove(id)
                .then(removed => {
                    res.json(post);
                })
                .catch(err => {
                    res
                    .status(500)
                    .json({ error: "The post could not be removed"}); 
                })
            : res
                .status(404)
                .json({ message: "The post with the specified ID does not exist." });
        })
        .catch(err => {
            res
            .status(500)
            .json({ error: "The post could not be removed"});
        });
    
})

routes.put('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    const updatedPost = req.body;
    updatedPost.title && updatedPost.contents
    ? db.update(id, updatedPost)
        .then(updated => {
            updated
            ? db.findById(id)
                .then(post => {
                    res.json(post);
                })
            : res
                .status(404)
                .json({ message: "The post with the specified ID does not exist." });
        })
        .catch(err => {
            res
                .status(500)
                .json({ error: "The user information could not be modified." });
        })
    : res
    .status(400)
    .json({ errorMessage: "Please provide title and contents for the post." });
})

routes.post('/api/posts', (req, res) => {
    const newPost = req.body;
    newPost.title && newPost.contents
    ? db.insert(newPost)
        .then(obj => {
            db.findById(obj.id)
                .then(post => {
                    res
                        .status(201)
                        .json(post);
                })
        })
        .catch(err => {
            res
                .status(500)
                .json({ error: "There was an error while saving the post to the database" });
        })
    : res
        .status(400)
        .json({ errorMessage: "Please provide title and contents for the post." });
})

module.exports = routes;