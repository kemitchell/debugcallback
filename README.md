debugcallback
=============

Help to debug missing callback calls

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