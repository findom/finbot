'use strict'

const request = require('request')

module.exports = function getCurrentWeather(weatherAPIKey, locationName, next) {
  //const requestUrl = `http://api.openweathermap.org/data/2.5/weather?units=imperial&appid=${weatherAPIKey}&q=${locationName}`
const requestUrl = `http://api.openweathermap.org/data/2.5/weather?units=imperial&appid=${de74482c028a81b624aa6225159db22a}&q=${locationName}`

  console.log('Making HTTP GET request to:', requestUrl)

  request(requestUrl, (err, res, body) => {
    if (err) {
      throw new Error(err)
    }

    if (body) {
      const parsedResult = JSON.parse(body)
      next(parsedResult)
    } else {
      next()
    }
  })
}
