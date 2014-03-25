/*jshint node:true*/
'use strict';

var
	// external modules
	winston = require('winston'),

	// globals
	isFunction = function isFunction(func) {
		return func && {}.toString.call(func) === '[object Function]';
	}
	;


/**
 * debugLog: log a message at the indicated level to the logger
 *           and call provided callback when done
 *
 * In:
 *     logFunc     : log function called with level, message and optional callback
 *     level       : log level to use (defaults to 'debug')
 *     message     : message to log
 *     callback    : callback to call once message is logged
 * Returns:
 *     nothing
 */
function debugLog( logFunc, level, message, callback ) {

	if( ! callback ) {
		if( isFunction( message ) ) {
			callback = message;
			message = level;
			level = 'debug';
		} else if( ! message ) {
			message = level;
			level = 'debug';
		}
	}

	if( isFunction( callback ) ) {
		logFunc(level, process.pid+': '+ message, callback );
	} else {
		logFunc(level, process.pid+': '+ message );
	}

}

/**
 * debugLog: wraps callback in a function that logs the provided message
 *           when called, and then calls the callback with the supplied
 *           arg8ments
 *
 * In:
 *     logFunc     : log function called with level, message and optional callback
 *     level       : log level to use (defaults to 'debug')
 *     message     : message to log
 *     callback    : callback to call once returned function is called
 * Returns:
 *     a function that logs the provided message and calls the callback
 *     with the arguments that were passed into the function.
 * Throws:
 *     Exception when callback provided is not a function.
 */
function debugCallback( logFunc, debugLog, level, message, callback ){
	if( ! callback ) {
		if( isFunction( message ) ) {
			callback = message;
			message = level;
			level = 'debug';
		} else if( ! message ) {
			message = level;
			level = 'debug';
		}
	}
	if( ! isFunction( callback ) ) {
		throw new Error('callback is not a function');
	}

	return function(){
		var args = Array.prototype.slice.call(arguments), that = this;
		debugLog( level, message, function(){
			if( isFunction( callback ) ) {
				callback.apply( that, args );
			}
		});
	};
}


module.exports =  function(logOrLogPath){
	var logFunc, debug = {}, logger;
	if( isFunction(logOrLogPath) ) {
		logFunc = logOrLogPath;
	} else if( typeof logOrLogPath === 'string' ) {
		logger = new (winston.Logger)({
			transports: [
				new (winston.transports.File)({
					filename: logOrLogPath,
					level:'silly'
				})
			]
		});
		logFunc = logger.log.bind(logger);
	} else {
		throw new Error('Log function or path to log file expected');
	}

	debug.log = debugLog.bind( false, logFunc );
	debug.callback = debugCallback.bind( false, logFunc, debug.log );

	return debug;
};