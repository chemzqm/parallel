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
    for (var i = 0; i < 2; i++) {
      parallel.add(function(cb) {
        getUser(i, function(err, user) {
          cb(err, user.name);
        })
      });
    }
    parallel.done(function(err, results) {
      expect(results).to.eql(['user0', 'user1']);
      done(err);
    })
  })

  it('should throw an timeout error', function(done) {
    var parallel = new Parallel();
    parallel.timeout(100);
    parallel.add(function(cb) {
      getUser(0, function(err, user) {
        cb(err, user);
      }, 200);
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
      }, 100);
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
})

