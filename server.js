var http = require('http')
var rc = require('./rc')
var handler = require('./handler')

http.createServer(handler).listen(rc.port, function () {
  console.log('blog server running on http://localhost:' + rc.port)
})
