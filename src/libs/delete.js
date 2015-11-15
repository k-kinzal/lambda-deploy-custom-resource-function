'use strict';

var AWS      = require('aws-sdk');
var Promise  = require('bluebird');

var lambda = Promise.promisifyAll(new AWS.Lambda(), {'suffix': 'Promise'});

module.exports = function(properties) {
  var params = {
    FunctionName: properties.FunctionName,
    Qualifier: properties.Qualifier
  };
  return lambda.deleteFunctionPromise(params);
};