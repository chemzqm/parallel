# Parallel

Parallel provide a simple way for management of parallel async call, you can remember the API just by a glance.

Normally we use [async](https://github.com/caolan/async) or [promise](https://github.com/then/promise) for parallel async control.
They can resolve every kind of async control problem we get, but the problem is they've done too much and it's neither easy to remember the complicated APIs nor refactoring the code.

## Installation

For node:

    npm install node-parallel

As component:

    component install chemzqm/parallel

## Example

``` js
var Parallel = reuiqre('parallel'); //The name is 'node-parallel' in node environment
var parallel = new Parallel();
parallel.timeout(3000);
for (var i = 0; i < 3; i++) {
  parallel.add(function(done){
    request.get('/user/' + i, function(err, res) {
      done(err, res.body.name);
    })
  })
}
parallel.done(function(err, results) {
  if (err) throw err;
  // results => ["jack", "tony", "fat"];
});
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
