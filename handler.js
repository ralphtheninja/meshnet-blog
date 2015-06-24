const ecstatic = require('ecstatic')({ root: __dirname + '/static' })
const debug = require('debug')('handler.js')
const app = require('./app.js')

module.exports = function (req, res) {
  debug('requesting %s', req.url)

  res.setHeader('Content-Type', 'text/html')

  if (req.url == '/') {
    return app.renderRoot(res)
  }

  if (~req.url.indexOf('/articles/')) {
    var slug = req.url.split('/articles/')[1]
    return app.renderArticle(slug, res)
  }

  ecstatic(req, res)
}
