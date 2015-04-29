# i-event

Simple way to resolve js async tasks.

## Installation

```bash
$ npm install i-event
```

## Usage
```js
var Events = require('i-event');
```

### Sample
```js
Events('sayhi', 'saybye', 'sayagain', function() {
		console.log('end of events');
	})
	.on('sayhi', function() {
		console.log('sayhi');
	})
	.on('sayhi', function sayhi2() {
		console.log('sayhi 2');
		this.off('sayhi', sayhi2);
	})
	.on('sayhello', function() {
		this.pub('sayhi');
	})
	.on('sayhello', 'saybye', function() {
		console.log('sayhello', 'saybye');
	})
	.on(['sayhello', 'saybye'], function() {
		console.log('in array', 'sayhello', 'saybye');
	})
	.once('sayhello', 'saybye', function() {
		console.log('once', 'sayhello', 'saybye');
	})
	.once(['sayhello', 'saybye'], function() {
		console.log('once in array', 'sayhello', 'saybye');
	})
	.on('saybye', function() {
		console.log('saybye');
	})
	.onFail(function() {
		console.log('fail');
	})
	.pub('sayhi')
	.pub('sayhello')
	.pub('saybye')
	.pub('saybye')
	.fail()
	.pub('sayagain');
```
will output:
```js
/*
sayhi
sayhi 2
sayhi
sayhello saybye
in array sayhello saybye
once sayhello saybye
once in array sayhello saybye
saybye
sayhello saybye
in array sayhello saybye
saybye
fail
*/
```
