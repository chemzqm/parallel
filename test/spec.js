/*global it,describe*/
var expect = require('chai').expect;
var Parallel = require('..');

function getUser(n, done, defer) {
  setTimeout(function() {
    done(null, { name: 'user' + n });
  }, defer);
}

describe('Parallel', function() {
  it('should return all the users', function(done) {
    var parallel = new Parallel();
    [0, 1].forEach(function(n) {
      parallel.add(function(cb) {
        getUser(n, function(err, user) {
          cb(err, user.name);
        })
      });
    })
    parallel.done(function(err, results) {
      expect(results).to.eql(['user0', 'user1']);
      done(err);
    })
  })

  it('should throw an timeout error', function(done) {
    var parallel = new Parallel();
    parallel.timeout(10);
    parallel.add(function(cb) {
      getUser(0, function(err, user) {
        cb(err, user);
      }, 20);
    })
    parallel.done(function(err) {
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.match(/^Timeout/);
      done();
    })
  })

  it('should have the error as first argument when error occurs in async call', function(done) {
    var parallel = new Parallel();
    parallel.add(function(cb) {
      setTimeout(function() {
        cb(new Error('Custom error'));
      }, 10);
    })
    parallel.add(function(cb) {
      cb(null, 'result');
    })
    parallel.done(function(err, results) {
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.match(/^Custom/);
      done();
    })
  })

  it('should only call the callback once', function(done) {
    var parallel = new Parallel();
    parallel.add(function(cb) {
      cb(null, 'result0');
    })
    parallel.add(function(cb) {
      cb(null, 'result1');
    })
    var t = 0;
    parallel.done(function(err) {
      t++;
      expect(t).to.equal(1);
      done(err);
    })
  })

  it('shound handle sync callbacks', function(done) {
    var parallel = new Parallel();
    parallel.add(function(cb) {
      cb(null, 'result0');
    })
    parallel.add(function(cb) {
      cb(null, 'result1');
    })
    parallel.done(function (err, results) {
      expect(results).to.eql(['result0', 'result1']);
      done(err);
    })
  })

  it('should throw an error if another callback defined', function(done) {
    var parallel = new Parallel();
    parallel.add(function(cb) {
      cb(null, {});
    })
    parallel.done(function(err) {
      if (err) return done(err);
    })
    var fn =function() {
      parallel.done(function() {});
    }
    expect(fn).to.throw(/^Callback/);
    done();
  })

  it('should be finished immediately when error occur', function(done) {
    var parallel = new Parallel();
    var s = new Date().getTime();
    parallel.add(function(cb) {
      setTimeout(function() {
        cb(new Error('user error'));
      }, 1);
    })
    parallel.add(function(cb) {
      setTimeout(function() {
        cb(null, []);
      }, 200);
    })
    parallel.done(function(err) {
      var e = new Date().getTime();
      expect(e - s).to.be.below(200);
      expect(err.message).to.match(/^user/);
      done();
    })
  })

  it('should return the result in sequence', function(done) {
    var parallel = new Parallel();
    parallel.add(function(cb) {
      setTimeout(function() {
        cb(null, 1);
      }, 50);
    })
    parallel.add(function(cb) {
      setTimeout(function() {
        cb(null, 2);
      }, 20);
    })
    parallel.add(function(cb) {
      setTimeout(function() {
        cb(null, 3);
      }, 10);
    })
    parallel.done(function(err, rs) {
      expect(rs).to.eql([1, 2, 3]);
      done(err);
    })
  })

  it('shoud ignore add callback called more than once', function (done) {
    var parallel = new Parallel();
    parallel.add(function (cb) {
      setTimeout(function () {
        cb(null, 1);
      },50)
      setTimeout(function () {
        cb(new Error('failed'));
      },60)
    })

    parallel.add(function (cb) {
      setTimeout(function () {
        cb(null, 2)
      })
    })
    parallel.done(function (err, rs) {
      if (err) return done(err)
      expect(rs).to.eql([1, 2]);
      done()
    })
  })

  it('should trigger done callback if no function added', function(done) {
    var parallel = new Parallel();
    parallel.done(function(err, rs) {
      expect(err).to.be.undefined;
      done(err);
    })
  })
})

