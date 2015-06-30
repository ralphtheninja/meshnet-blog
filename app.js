const fs = require('fs')
const Handlebars = require('handlebars')
const marked = require('marked')
const xtend = require('xtend')

const rootDir = __dirname + '/static'
const articlesDir = rootDir + '/articles'
const articles = {}

// read css file
var css = fs.readFileSync(rootDir + '/index.css', 'utf8')

// get meta data on articles
fs.readdirSync(articlesDir).forEach(function (file) {
  if (~file.indexOf('.md')) {
    var slug = file.split('.md')[0]
    var path = articlesDir + '/' + file
    var stat = fs.statSync(path)
    articles[slug] = {
      slug: slug,
      title: slug.split('-').join(' '),
      path: path,
      time: stat.birthtime.getTime()
    }
  }
})

// create template
var index = fs.readFileSync(rootDir + '/index.html', 'utf8')
var template = Handlebars.compile(index)

// render index.html page
var root = render({
  title: 'welcome to meshnet.works!',
  articles: Object.keys(articles).map(function (slug) {
    return articles[slug]
  }).sort(function (a, b) {
    return a.time < b.time
  })
})

// render all article pages
Object.keys(articles).forEach(function (slug) {
  var article = articles[slug]
  article.preRendered = render({
    title: article.title,
    article: {
      html: marked(fs.readFileSync(article.path, 'utf8'))
    }
  })
  delete article.path
})

function render(obj) {
  return template(context(obj))
}

function context(obj) {
  return xtend({ css: css }, obj)
}

exports.renderRoot = function (res) {
  return end(res, root)
}

exports.renderArticle = function (slug, res) {
  var article = articles[slug]
  if (article && article.preRendered) {
    return end(res, article.preRendered)
  }
  res.statusCode = 404
  res.statusMessage = 'no such article'
  res.end()
}

function end(res, text) {
  res.statusCode = 200
  res.end(text)
}

