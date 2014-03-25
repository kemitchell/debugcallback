/*jshint node:true*/
/*globals
    describe   : false,
    it         : false */
/*,
    before     : false,
    beforeEach : false,
    after      : false,
    afterEach  : false */
'use strict';

var assert = require('assert'),
	debug = require('index.js');

describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});

describe('debugLog', function(){
	describe('log()', function(){
		it('should call log function', function(done){
			(debug(function(){
				done();
			})).log('message');
		});
		it('should call log function with correct message and level', function(done){
			var level = 'info', message = 'message';
			(debug(function(iLevel,iMessage){
				assert.strictEqual( iLevel, level );
				assert.strictEqual( iMessage, process.pid+': '+ message );
				done();
			})).log('info', 'message');
		});
		it('should call log function with correct callback', function(done){
			(debug(function(iLevel,iMessage, iDone){
				assert.strictEqual( iDone, done );
				done();
			})).log('info', 'message', done);
		});
	});

	describe('callback',function(){
		it('should create a callback that calls the original callback', function(done){
			var debugObject = debug(function(iLevel,iMessage, iDone){
					iDone();
				}),
				callback = debugObject.callback('info', 'message', done)
				;
			callback();
		});
		it('should create a callback that logs the correct message and level', function(done){
			var level = 'info', message = 'message',
				debugObject = debug(function(iLevel,iMessage, iDone){
					assert.strictEqual( iLevel, level );
					assert.strictEqual( iMessage, process.pid+': '+ message );
					iDone();
				}),
				callback = debugObject.callback(level, message, done)
				;
			callback();
		});
	});
});