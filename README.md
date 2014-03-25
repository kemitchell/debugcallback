debugcallback
=============

Help to debug missing callback calls.

Synopsis
--------

	var
		debug = require('./index.js')(function(level, message, callback){
			console.log('logging:', level, message);
			if( callback ) {
				callback();
			}
		});

	function wayWardFunction(callback){
		debug.log('waywardFunction started');
		callback = debug.callback('waywardFunction finished', callback);
		setTimeout(callback, 1000);
	}

	wayWardFunction(function(){
		console.log('callback actually called');
	});

How to use
----------

### Setup:
The module exposes a function. Call with a filename to log to this file, or with
a function to have that function called with the log message. The function exposed
returns an object with 2 methods, `log` and `callback`

The function to be provided should accept 3 arguments: level (string),
message (string) and callback, and should call the callback once logging is done.
Hint: [winston](https://github.com/flatiron/winston/)'s `log` function will do...

### Debugging:
Call the `log` function for immediate logging, and `callback` to wrap a callback
in a logging call.