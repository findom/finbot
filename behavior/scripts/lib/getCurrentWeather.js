'use strict'

const request = require('request')

module.exports = function getCurrentWeather(locationName, next) {
  const appId = 'cd1151ee89fcbfb88ab227df11e28190'

  const requestUrl = `http://api.openweathermap.org/data/2.5/weather?units=imperial&appid=${appId}&q=${locationName}`

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
