const express = require('express');
const logger = require('morgan');
const jwt = require('jsonwebtoken')
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(logger('dev'));




app.get('/health', (req, res) => res.send(`It's a healthy goat parade! ${'🐐'.repeat(20)}`));

const echo = (req, res) => res.json({headers: req.headers, body: req.body, query: req.query});

app.get('/echo', echo);
app.post('/echo', echo);


// 404 handler
app.all('*', (req, res) => res.status(404).send('Not found'));

module.exports = app;