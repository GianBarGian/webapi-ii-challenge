const express = require('express');
const posts = require('./data/seeds/posts');

const routes = express.Router();

routes.use(express.json());

module.exports = routes;