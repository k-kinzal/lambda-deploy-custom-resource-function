'use strict';

var AWS      = require('aws-sdk');
var JSZip    = require('jszip');
var Promise  = require('bluebird');
var path     = require('path');
var request  = require('request');

var lambda = Promise.promisifyAll(new AWS.Lambda(), {'suffix': 'Promise'});

module.exports = function(properties) {
  return Promise.resolve(new JSZip()).then(function(archive) {
    return (new Promise(function(resolve, reject) {
      var options = {
        url: properties.URL,
        encoding: null
      };
      request.get(options, function(err, response) {
        if (err) {
          reject(err);
        } else {
          resolve(response.body);
        }
      });
    })).then(function(buffer) {
      return archive.load(buffer);
    });
  }).then(function(archive) {
    if (!properties.Config) {
      return archive;
    }
    var config = properties.Config;
    var configDir = path.dirname(properties.ConfigPath || 'config/local.json');
    var configFileName = path.basename(properties.ConfigPath || 'config/local.json');
    return archive.folder(configDir)
                  .file(configFileName, JSON.stringify(config));

  }).then(function(archive) {
    var params = {
      Code: {
        ZipFile: archive.generate({type:"nodebuffer"})
      },
      FunctionName: properties.FunctionName,
      Handler:      properties.Handler,
      Role:         properties.Role,
      Runtime:      properties.Runtime,
      Description:  properties.Description || '',
      MemorySize:   parseInt(properties.MemorySize || 0),
      Publish:      properties.Publish === "true" ? true : false,
      Timeout:      parseInt(properties.Timeout || 0)
    };
    return lambda.createFunctionPromise(params);

  });
};