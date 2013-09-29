var fs = require('fs');
var Parallel = require('..');

var files = ['fetch.js', 'read.js'];

var parallel = new Parallel();
files.forEach(function(file) {
  parallel.add(function(done) {
    fs.readFile(file, 'utf8', done);
  })
})
parallel.done(function(err, rs) {
  if(err) throw err;
  var l = 0;
  rs.forEach(function(content) {
    l = l + content.split('\n').length;
  })
  console.log(l);
})

