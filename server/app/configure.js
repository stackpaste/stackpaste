
const morgan = require('morgan');
const compression = require('compression');
const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');

const loggingMiddleware = process.env.NODE_ENV === 'production' ? morgan('combined') : morgan('dev');

module.exports = (app) => {
  const root = path.join(__dirname, '../../');

  const npmPath = path.join(root, './node_modules');
  const publicPath = path.join(root, './public');
  const distPath = path.join(root, './dist');
  const indexPath = path.join(distPath, './index.html');

  // Logging and compression middleware
  app.use(loggingMiddleware);
  app.set('indexPath', indexPath);

  // static middleware
  app.use(express.static(npmPath));
  app.use(express.static(publicPath));
  app.use(express.static(distPath));
  // Parse our POST and PUT bodies.
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(compression());
};
