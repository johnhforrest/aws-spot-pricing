var AWS = require('aws-sdk');

var myCredentials = new AWS.Credentials(process.env.AWS_CLIENT_ID, process.env.AWS_CLIENT_SECRET);
AWS.config.update({ credentials: myCredentials, region: 'us-east-1' });

module.exports.getSpotPrices = function () {
  return new Promise(function (resolve, reject) {
    // us-east-1a isn't available to new users, but let's query it anyway
    var filters = ['us-east-1a', 'us-east-1b', 'us-east-1c', 'us-east-1d', 'us-east-1e'];
    var params = {
      Filters: [
        {
          Name: 'availability-zone',
          Values: []
        }
      ]
    };

    var ec2 = new AWS.EC2();
    var count = filters.length;
    var spotPrices = {};

    for (var i = 0; i < filters.length; i++) {
      var filter = filters[i];
      params.Filters[0].Values[0] = filter;

      ec2.describeSpotPriceHistory(params, function (error, data) {
        var zone =
        count--;

        if (data && data.SpotPriceHistory && data.SpotPriceHistory.length) {
          var zone = data.SpotPriceHistory[0].AvailabilityZone;
          spotPrices[zone] = data.SpotPriceHistory;
        }

        if (count === 0) {
          if (error) {
            reject(error);
          } else {
            resolve(spotPrices);
          }
        } else if (error) {
          console.log(error);
        }
      });
    }
  });
}
