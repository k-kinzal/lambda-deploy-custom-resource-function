'use strict';

var Bluebird     = require('bluebird');
var response     = require('./libs/cfn-response');
var createLambda = require('./libs/create');
var updateLambda = require('./libs/update');
var deleteLambda = require('./libs/delete');

/**
 * Deploy to lambda function by Cloudformation custom resouce.
 *
 * @param {Object} event lambda event object
 * @param {Object} context lambda context
 */
exports.handler = function(event, context) {
  return Bluebird.resolve().then(function() {
    switch (event.RequestType) {
    case 'Create':
      return createLambda(event.ResourceProperties);
    case 'Update':
      return updateLambda(event.ResourceProperties);
    case 'Delete':
      return deleteLambda(event.ResourceProperties);
    default:
      throw new Error('Undefined request type `' + event.RequestType + '`');
    }
  }).then(function(data) {
    var responseData = {
      Arn: data.FunctionArn,
      Name: data.FunctionName || event.ResourceProperties.FunctionName
    };
    response.send(event, context, response.SUCCESS, responseData);

  }).catch(function(err) {
    var responseData = {
      Error: err.toString()
    };
    response.send(event, context, response.FAILED, responseData);

  });

};
