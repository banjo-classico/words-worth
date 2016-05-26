const geocoder = require('geocoder')

function getGeoCode(location, callback) {
  geocoder.geocode(location, function(err, data) {
        if (data.results[0] !== undefined) {
          var geoCode = data.results[0].geometry.location
          callback(null, geoCode)
        }
      })
}


module.exports = {
  getGeoCode: getGeoCode
}