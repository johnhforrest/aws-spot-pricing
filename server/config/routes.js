/**
 * Routes for express app
 */
var express = require('express');
var _ = require('lodash');
var path = require('path');
var cache = require('memory-cache');

var App = require(path.resolve(__dirname, '../../', 'public', 'assets', 'server.js'))['default'];
var scraper = require('../scraper');
var awsQueries = require('../awsQueries');
var helpers = require('../helpers');

module.exports = function(app) {
  app.post('/refreshInstanceCache', function (req, res) {
    scraper.cacheInstanceCapabilities()
      .then(function (lastCached) {
        res.json({ lastCached });
      })
      .catch(function (error) {
        console.log(error);
        res.json(error);
      });
  });

  app.get('/getSpotPrices', function (req, res) {
    awsQueries.getSpotPrices()
      .then(function (data) {
        res.json(data);
      })
      .catch(function (error) {
        console.log(error);
        res.json(error);
      });
  });

  app.post('/calculateOptimalCluster', function (req, res) {
    var requirements = {
      vCpus: req.body.cpu,
      memory: req.body.memory,
      storage: req.body.storage
    };

    if (!requirements.vCpus || !requirements.memory || !requirements.storage) {
      res.json({ error: 'Missing POST parameters' });
      return;
    }

    var instanceRequirements = null;
    if (req.body.instanceReq) {
      instanceRequirements = {
        vCpus: req.body.instanceCpu,
        memory: req.body.instanceMemory,
        storage: req.body.instanceStorage
      };

      if (!instanceRequirements.vCpus || !instanceRequirements.memory || !instanceRequirements.storage) {
        res.json({ error: 'Missing POST parameters' });
        return;
      }

      requirements.instanceRequirements = instanceRequirements;
    }

    var cachedInstances = cache.get('instances');
    if (cachedInstances) {
      awsQueries.getSpotPrices()
        .then(function (spotPrices) {
          var joinedInstances = helpers.joinInstancesAndSpotPrices(cachedInstances, spotPrices);
          var optimalCluster = helpers.calculateOptimalCluster(joinedInstances, requirements);
          res.json(optimalCluster);
        })
        .catch(function (error) {
          console.log(error);
          res.json(error);
        });
    }
  })

  // This is where the magic happens. We take the locals data we have already
  // fetched and seed our stores with data.
  // App is a function that requires store data and url to initialize and return the React-rendered html string
  app.get('*', function (req, res, next) {
    var lastCached = cache.get('lastCached');
    App(req, res, lastCached);
  });

};
