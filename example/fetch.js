var request = require('superagent');
var Parallel = require('../');
var parallel = new Parallel();
var urls = [
  'http://component.io',
  'http://www.admaster.com.cn',
  'http://jing.fm',
  'http://weibo.com',
  'http://baidu.com',
  'http://chemzqm.me'
];
var s = new Date().getTime();
urls.forEach(function(url){
  parallel.add(function(done){
    request.get(url, function(err, res){
      var e = new Date().getTime();
      console.log(url);
      console.log((e - s)/1000);
      if(err) return done(err);
      done(null, res.status);
    })
  })
})
parallel.done(function(err, rs){
  if (err) throw err;
  var e = new Date().getTime();
  console.log(rs);
});
