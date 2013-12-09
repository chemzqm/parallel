[![Build Status](https://secure.travis-ci.org/chemzqm/parallel.png)](http://travis-ci.org/chemzqm/parallel)
[![Coverage Status](https://coveralls.io/repos/chemzqm/parallel/badge.png?branch=master)](https://coveralls.io/r/chemzqm/parallel?branch=master)

# Parallel

Parallel provide a simple but powerful way for management of parallel async call.

Normally we use [async](https://github.com/caolan/async) or [promise](https://github.com/then/promise) for parallel async control.
They can resolve every kind of async control problem we get, but the problem is they've done too much and it's neither easy to remember the complicated APIs nor refactoring the code.

Consider [chemzqm/serial](https://github.com/chemzqm/serial) if you want to control serial callbacks, they have almost the same API.

## Installation

Via npm:

    npm install node-parallel

Via [component](https://github.com/component/component):

    component install chemzqm/parallel

## Features

* Unified error handling.
* Timeout support.
* Immediate finished when error occur.
* No magic on finished callback, just one function.

## Test on node and browser

You must have `component` installed for browser usage and `mocha`, `mocha-phantomjs` installed for testing.

``` bash
$ npm install -g component mocha mocha-phantomjs
$ git clone git@github.com:chemzqm/parallel.git
$ cd parallel && npm install
$ make
#run test on server side
$ make test 
#run test through phantomjs
$ make phantomjs 
```

## Example

```js
var parallel = require('parallel');
var fs = require('fs');

parallel()
  .timeout(3000)
  .add(function(done) {
    fs.readFile('package.json', 'utf8', done);
  })
  .add(function(done) {
    fs.readFile('index.js', 'utf8', done);
  })
  .done(function(err, results) {
    console.log(results[0]);
    console.log(results[1]);
  })
```

## API

### Parallel()

Init new Parallel instance.

### .timeout(Number)

Set the timeout to number `ms`, default is `10s`.

### .add(Function)

Add Function to parallel, the first argument is a callback function, it should be called with `error` as first argument and result you need as secound argument.

### .done(Function)

The callback function is called with `error` (null or undefined if not exist) and the result array when all the request get finished (or timeout reached).

**Note**, this function should only be called once.

## License

  MIT
