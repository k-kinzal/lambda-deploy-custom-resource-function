'use strict';

var assert  = require('power-assert');
var factory = require('lambda-handler');
var fake    = require('fakeaws');
var fs      = require('fs');
var nock    = require('nock');
var path    = require('path');
var sinon   = require('sinon');
var response = require('../src/libs/cfn-response');
var handlerPath = path.resolve('./src/index');

describe('Lambda entry point:', function() {
  describe('Create:', function() {
    var fixturePath = path.resolve('./test/fixtures/create.json');
    var mocks = {
      'aws-sdk': fake.AWS,
      './libs/cfn-response': response
    };

    var handler, event, context;
    beforeEach(factory(handlerPath, fixturePath, mocks,
      function(_handler, _event, _context) {
      handler = _handler;
      event   = _event;
      context = _context;
    }));

    var originalSend;
    beforeEach(function() {
      fake.reflash();
      response.send = function() {};
    });

    it('should call to success', function() {
      nock('https://example.com/')
        .get('/archive.zip')
        .reply(200, function(_, __, cb) {
          fs.readFile(path.resolve('./test/resources/archive.zip'), cb);
        });
      fake.mockResponse('lambda.createFunction', {
        CodeSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        CodeSize: 100,
        Description: 'Example function',
        FunctionArn: 'arn:aws:lambda:us-east-1:000000000000:function:example-function',
        FunctionName: 'example-function',
        Handler: 'src/index.handler',
        LastModified: 'Sat, 29 Oct 1994 19:43:31 GMT',
        MemorySize: 128,
        Role: 'arn:aws:iam::000000000000:role/lambda_basic_execution',
        Runtime: 'nodejs',
        Timeout: 3,
        Version: '$LATEST'
      });
      response.send = sinon.spy(response, 'send');

      return handler(event, context).then(function() {
        var responseData = {
          Arn: 'arn:aws:lambda:us-east-1:000000000000:function:example-function',
          Name: 'example-function'
        };
        assert.deepEqual(response.send.args[0][3], responseData);
        assert(response.send.args[0][2] === response.SUCCESS);
        assert(response.send.args[0][1] === context);
        assert(response.send.args[0][0] === event);
      });
    });

    it('should call to error', function() {
      nock('https://example.com/')
        .get('/archive.zip')
        .reply(200, function(_, __, cb) {
          fs.readFile(path.resolve('./test/resources/archive.zip'), cb);
        });
      fake.mockErrorResponse('lambda.createFunction', {
        message: 'test error',
        statusCode: 500,
      });
      response.send = sinon.spy(response, 'send');

      return handler(event, context).then(function() {
        var responseData = {
          Error: 'Error: test error'
        };
        assert.deepEqual(response.send.args[0][3], responseData);
        assert(response.send.args[0][2] === response.FAILED);
        assert(response.send.args[0][1] === context);
        assert(response.send.args[0][0] === event);
      });
    });
  });

  describe('Update:', function() {
    var fixturePath = path.resolve('./test/fixtures/update.json');
    var mocks = {
      'aws-sdk': fake.AWS,
      './libs/cfn-response': response
    };

    var handler, event, context;
    beforeEach(factory(handlerPath, fixturePath, mocks,
      function(_handler, _event, _context) {
      handler = _handler;
      event   = _event;
      context = _context;
    }));

    var originalSend;
    beforeEach(function() {
      fake.reflash();
      response.send = function() {};
    });

    it('should call to success', function() {
      nock('https://example.com/')
        .get('/archive.zip')
        .reply(200, function(_, __, cb) {
          fs.readFile(path.resolve('./test/resources/archive.zip'), cb);
        });
      fake.mockResponse('lambda.updateFunctionCode', {
        CodeSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        CodeSize: 100,
        Description: 'Example function',
        FunctionArn: 'arn:aws:lambda:us-east-1:000000000000:function:example-function',
        FunctionName: 'example-function',
        Handler: 'src/index.handler',
        LastModified: 'Sat, 29 Oct 1994 19:43:31 GMT',
        MemorySize: 128,
        Role: 'arn:aws:iam::000000000000:role/lambda_basic_execution',
        Runtime: 'nodejs',
        Timeout: 3,
        Version: '$LATEST'
      });
      fake.mockResponse('lambda.updateFunctionConfiguration', {
        CodeSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        CodeSize: 100,
        Description: 'Example function',
        FunctionArn: 'arn:aws:lambda:us-east-1:000000000000:function:example-function',
        FunctionName: 'example-function',
        Handler: 'src/index.handler',
        LastModified: 'Sat, 29 Oct 1994 19:43:31 GMT',
        MemorySize: 128,
        Role: 'arn:aws:iam::000000000000:role/lambda_basic_execution',
        Runtime: 'nodejs',
        Timeout: 3,
        Version: '$LATEST'
      });
      response.send = sinon.spy(response, 'send');

      return handler(event, context).then(function() {
        var responseData = {
          Arn: 'arn:aws:lambda:us-east-1:000000000000:function:example-function',
          Name: 'example-function'
        };
        assert.deepEqual(response.send.args[0][3], responseData);
        assert(response.send.args[0][2] === response.SUCCESS);
        assert(response.send.args[0][1] === context);
        assert(response.send.args[0][0] === event);
      });
    });

    it('should call to error', function() {
      nock('https://example.com/')
        .get('/archive.zip')
        .reply(200, function(_, __, cb) {
          fs.readFile(path.resolve('./test/resources/archive.zip'), cb);
        });
      fake.mockErrorResponse('lambda.updateFunctionCode', {
        message: 'test error',
        statusCode: 500,
      });
      response.send = sinon.spy(response, 'send');

      return handler(event, context).then(function() {
        var responseData = {
          Error: 'Error: test error'
        };
        assert.deepEqual(response.send.args[0][3], responseData);
        assert(response.send.args[0][2] === response.FAILED);
        assert(response.send.args[0][1] === context);
        assert(response.send.args[0][0] === event);
      });
    });
  });

  describe('Delete:', function() {
    var fixturePath = path.resolve('./test/fixtures/delete.json');
    var mocks = {
      'aws-sdk': fake.AWS,
      './libs/cfn-response': response
    };

    var handler, event, context;
    beforeEach(factory(handlerPath, fixturePath, mocks,
      function(_handler, _event, _context) {
      handler = _handler;
      event   = _event;
      context = _context;
    }));

    var originalSend;
    beforeEach(function() {
      fake.reflash();
      response.send = function() {};
    });

    it('should call to success', function() {
      nock('https://example.com/')
        .get('/archive.zip')
        .reply(200, function(_, __, cb) {
          fs.readFile(path.resolve('./test/resources/archive.zip'), cb);
        });
      fake.mockResponse('lambda.deleteFunction', {});
      response.send = sinon.spy(response, 'send');

      return handler(event, context).then(function() {
        var responseData = {
          Arn: undefined,
          Name: 'example-function'
        };
        assert.deepEqual(response.send.args[0][3], responseData);
        assert(response.send.args[0][2] === response.SUCCESS);
        assert(response.send.args[0][1] === context);
        assert(response.send.args[0][0] === event);
      });
    });

    it('should call to error', function() {
      nock('https://example.com/')
        .get('/archive.zip')
        .reply(200, function(_, __, cb) {
          fs.readFile(path.resolve('./test/resources/archive.zip'), cb);
        });
      fake.mockErrorResponse('lambda.deleteFunction', {
        message: 'test error',
        statusCode: 500,
      });
      response.send = sinon.spy(response, 'send');

      return handler(event, context).then(function() {
        var responseData = {
          Error: 'Error: test error'
        };
        assert.deepEqual(response.send.args[0][3], responseData);
        assert(response.send.args[0][2] === response.FAILED);
        assert(response.send.args[0][1] === context);
        assert(response.send.args[0][0] === event);
      });
    });
  });

});
