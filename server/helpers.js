module.exports.joinInstancesAndSpotPrices = function (instances, spotPrices) {
  var resultingData = {};

  for (var availabilityZone in spotPrices) {
    if (spotPrices.hasOwnProperty(availabilityZone)) {
      for (var i = 0; i < spotPrices[availabilityZone].length; i++) {
        var zonePrice = spotPrices[availabilityZone][i];
        var apiName = zonePrice.InstanceType;

        if (resultingData[apiName]) {
          // if we don't currently have a price for this api in this availability zone,
          // or if the price of this api with a different operating system in the same availability zone is cheaper
          var price = parseFloat(zonePrice.SpotPrice);
          if (!resultingData[apiName].prices[availabilityZone] ||
            price < resultingData[apiName].prices[availabilityZone].price) {
            resultingData[apiName].prices[availabilityZone] = {
              price: price,
              operatingSystem: zonePrice.ProductDescription
            };
          }
        } else if (instances[apiName]) {
          var joinedInstance = {
            apiName: apiName,
            vCpus: parseInt(instances[apiName].vCpus),
            memory: parseFloat(instances[apiName].memory),
            storage: parseFloat(instances[apiName].storage),
            prices: {}
          };

          joinedInstance.prices[availabilityZone] = {
            price: parseFloat(zonePrice.SpotPrice),
            operatingSystem: zonePrice.ProductDescription
          };
          resultingData[apiName] = joinedInstance;
        }
      }
    }
  }

  return resultingData;
};

module.exports.calculateOptimalCluster = function (joinedInstances, requirements) {
  var optimalCluster = {
    totalPrice: Infinity
  };

  for (var apiName in joinedInstances) {
    if (joinedInstances.hasOwnProperty(apiName)) {
      var instance = joinedInstances[apiName];
      var vCpus = instance.vCpus;
      var memory = instance.memory;
      var storage = instance.storage;
      var cheapestZone = getCheapestAvailabilityZone(instance);

      var cluster = {
        instance,
        availabilityZone: cheapestZone.availabilityZone,
        operatingSystem: cheapestZone.operatingSystem,
        totalPrice: cheapestZone.price,
        numMachines: 1,
        totalvCpus: vCpus,
        totalMemory: memory,
        totalStorage: storage
      };

      // if instance requirements are enabled, first ensure that this instance meets those
      var instanceRequirements = requirements.instanceRequirements;
      if (instanceRequirements &&
        (vCpus < instanceRequirements.vCpus ||
          memory < instanceRequirements.memory ||
          storage < instanceRequirements.storage)) {
        continue;
      }

      // adding machines to cluster until requirements are met
      while (cluster.totalvCpus < requirements.vCpus ||
        cluster.totalMemory < requirements.memory ||
        cluster.totalStorage < requirements.storage) {
          cluster.numMachines++;
          cluster.totalPrice += cheapestZone.price;
          cluster.totalvCpus += vCpus;
          cluster.totalMemory += memory;
          cluster.totalStorage += storage;
      }

      if (cluster.totalPrice < optimalCluster.totalPrice) {
        optimalCluster = cluster;
      }
    }
  }

  return optimalCluster;
};

function getCheapestAvailabilityZone(instance) {
  var cheapestZone = {
    price: Infinity
  };

  for (var availabilityZone in instance.prices) {
    if (instance.prices.hasOwnProperty(availabilityZone)) {
      var price = instance.prices[availabilityZone].price;

      if (price < cheapestZone.price) {
        cheapestZone = {
          availabilityZone: availabilityZone,
          operatingSystem: instance.prices[availabilityZone].operatingSystem,
          price: price
        };
      }
    }
  }

  return cheapestZone;
}
