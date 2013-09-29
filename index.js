var nextTick = require('next-tick');
/**
 * Parallel Class
 * @api public
 */
function Parallel () {
  this.results = [];
  this.t = 10000;
  this.cbs = [];
}

/**
 * 
 * @param {String} ms
 * @api public
 */
Parallel.prototype.timeout = function(ms) {
  this.t = ms;
}

/**
 * Add parallel function
 *
 * @param {String} fn
 * @api public
 */
Parallel.prototype.add = function(fn) {
  var self = this;
  this.len = (this.len || 0) + 1;
  var cb = timeout(function(err, res) {
    if (self.finished === true) return;
    var results = self.results;
    results.push(res);
    self.called = (self.called || 0) + 1;
    self.finish(err);
  }, this.t);
  fn(function() {
    var args = arguments;
    nextTick(function() {
      cb.apply(null, args);
    })
  });
}

/**
 * cb is called when all parallel function finished
 * this function should only be called once
 *
 * @param {String} cb
 * @api public
 */
Parallel.prototype.done = function(cb) {
  if(this.cb) throw new Error('Callback exist');
  var self = this;
  this.cb = function() {
    self.finished = true;
    cb.apply(null, arguments);
    delete self.cbs;
  }
  this.finish();
}

Parallel.prototype.finish = function(err) {
  var cb = this.cb;
  if (err) this.err = err;
  if (err && cb) return cb(err, this.results);
  if(!cb || this.finished) return;
  if (this.len === this.called) {
    cb(this.err, this.results);
  }
}

function timeout (fn, ms) {
  var called;
  var id = setTimeout(function(){
    fn(new Error('Timeout ' + ms + ' reached'));
    called = true;
  }, ms);
  var cb = function() {
    if (called) return;
    clearTimeout(id);
    fn.apply(null, arguments);
  }
  return cb;
}

module.exports = Parallel;
