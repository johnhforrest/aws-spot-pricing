var fetch = require('node-fetch');
var xml2js = require('xml2js');
var cache = require('memory-cache');

module.exports.cacheInstanceCapabilities = function() {
  return new Promise(function (resolve, reject) {
    fetch('http://www.ec2instances.info')
      .then(function (fetchRes) {
        return fetchRes.text();
      })
      .then(function (body) {
        var regex = /\<tbody\>[\s\S]*<\/tbody>/;

        var startIndex = body.indexOf("<tbody>");
        var endIndex = body.indexOf("</tbody>", startIndex);
        var substring = body.substr(startIndex, endIndex - startIndex + 8);

        var parser = new xml2js.Parser();

        parser.parseString(substring, function (err, result) {
          if (err) {
            reject(err);
          } else {
            var instances = {};
            var tableRows = result.tbody.tr;
            var storageRegex = /^(\d*\.\d* GB)/;

            for (var i = 0; i < tableRows.length; i++) {
              var row = tableRows[i];
              var storage = row.td[6].span[0]._.trim();

              // only cache this instance if it has its own disk space
              if (storage.indexOf("EBS") === -1) {
                var instance = {
                  name: row.td[0]._.trim(),
                  apiName: row.td[1]._.trim(),
                  memory: row.td[2].span[0]._,
                  vCpus: row.td[4].span[0]._.trim(),
                  storage: storageRegex.exec(storage)[0] // extract the total value of storage space
                };

                instances[instance.apiName] = instance;
              }
            }

            var cacheTime = new Date().getTime();
            cache.put('instances', instances);
            cache.put('lastCached', cacheTime);
            resolve(cacheTime);
          }
        });
      })
      .catch(function (error) {
        reject(error);
      });
  });
}
