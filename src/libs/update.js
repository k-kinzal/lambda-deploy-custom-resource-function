'use strict';

var AWS      = require('aws-sdk');
var JSZip    = require('jszip');
var Promise  = require('bluebird');
var path     = require('path');

var lambda = Promise.promisifyAll(new AWS.Lambda(), {'suffix': 'Promise'});

module.exports = function(properties) {
  return Promise.resolve(new JSZip()).then(function(archive) {
    return (new Promise(function(resolve, reject) {
      var http = properties.URL.match(/^https/) ? require('https') : require('http');
      var req = http.request(properties.URL, function(res) {
        var data = [];
        res.setEncoding('binary');
        res.on('data', function (chunk) {
          data.push(new Buffer(chunk, 'binary'));
        });
        res.on('error', function (err) {
          reject(err);
        });
        res.on('end', function () {
          resolve(Buffer.concat(data));
        });
      });
      req.end();
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
      FunctionName: properties.FunctionName,
      Publish:      properties.Publish === "true" ? true : false,
      ZipFile:      archive.generate({type:"nodebuffer"})
    };
    return lambda.updateFunctionCodePromise(params);

  }).then(function() {
    var params = {
      FunctionName: properties.FunctionName,
      Description:  properties.Description || '',
      Handler:      properties.Handler,
      MemorySize:   parseInt(properties.MemorySize || 0),
      Role:         properties.Role,
      Timeout:      parseInt(properties.Timeout || 0)
    };
    return lambda.updateFunctionConfigurationPromise(params);

  });
};