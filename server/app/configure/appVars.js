
const path = require('path');

const rootPath = path.join(__dirname, '../../../');
const indexPath = path.join(rootPath, './dist/index.html');

const env = require(path.join(rootPath, './server/env'));

module.exports = function (app) {
  app.setValue('env', env);
  app.setValue('projectRoot', rootPath);
  app.setValue('indexHTMLPath', indexPath);
};