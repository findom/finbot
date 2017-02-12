'use strict'

const getCurrentWeather = require('./lib/getCurrentWeather')

exports.handle = function handle(client) {
  // The Prince will greet people.
  const sayHello = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().helloSent)
    },

    prompt() {
      client.addResponse('welcome')
      client.addResponse('provide/documentation', {
        documentation_link: 'http://docs.init.ai',
      })
      //client.addResponse('provide/instructions')
      client.updateConversationState({
        helloSent: true
      })
      client.done()
    }
  })

  // The Prince dislikes being disturbed.
  const handleGreeting = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('greeting/ask_bothered')
      client.done()
    }
  })

  // The Prince charges an invoice as he dismissed people.
  const handleGoodbye = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('goodbye/invoice')
      client.done()
    }
  })


  // The weather bot get city input.
    const collectXp = client.createStep({
      satisfied() {
        return Boolean(client.getConversationState().weatherCity)
      },

      extractInfo() {
       const city = client.getFirstEntityWithRole(client.getMessagePart(), 'city')
        if (city) {
          client.updateConversationState({
            weatherCity: city,
          })
          console.log('User wants the weather in:', city.value)
        }
      },

      prompt() {
        //client.addResponse('prompt/weather_city')
        client.done()
      },
    })



// The weather bot get city input.
  const collectCity = client.createStep({
    satisfied() {
      const city = client.getFirstEntityWithRole(client.getMessagePart(), 'city')
       if (city) {
         client.updateConversationState({
           weatherCity: city,
         })
         console.log('User asked for weather in new city:', city.value)
       }
      return Boolean(client.getConversationState().weatherCity)
    },

    extractInfo() {
     const city = client.getFirstEntityWithRole(client.getMessagePart(), 'city')
      if (city) {
        client.updateConversationState({
          weatherCity: city,
        })
        console.log('User wants the weather in:', city.value)
      }
    },

    prompt() {
      //client.addResponse('prompt/weather_city')
      client.done()
    },
  })

  const provideWeather = client.createStep({
  satisfied() {
    return false
  },

  prompt(callback) {
    getCurrentWeather(client.getConversationState().weatherCity.value, resultBody => {
      if (!resultBody || resultBody.cod !== 200) {
        console.log('Error getting weather.')
        callback()
        return
      }

      const weatherDescription = (
        resultBody.weather.length > 0 ?
        resultBody.weather[0].description :
        null
      )

      const weatherData = {
        temperature: resultBody.main.temp,
        condition: weatherDescription,
        city: resultBody.name,
      }

      console.log('sending real weather:', weatherData)
      client.addResponse('provide_weather/current', weatherData)
      client.done()

      callback()
    })
  }
})

// The weather bot get city input.
  const collectMood = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().currentMood)
    },

    extractInfo() {
     const mood = client.getFirstEntityWithRole(client.getMessagePart(), 'mood')
      if (mood) {
        client.updateConversationState({
          currentMood: mood,
        })
        console.log('User is currently feeling ', mood.value)
      }
    },

    prompt() {
      client.addResponse('request_user/current_mood')
      client.done()
    },
  })

  // Get city user input and output weather.
  client.runFlow({
    classifications: {
      goodbye: 'goodbye',
      greeting: 'greeting',
      greeting2: 'greeting/ask_bothered'
      //getMood: 'prompt/current_mood'
    },
    streams: {
      // Add a Stream for goodbye and assign it a Step
      goodbye: handleGoodbye,
      greeting: handleGreeting,
      greeting2: handleGreeting,
      main: 'getWeather',
      hi: [sayHello],
      getWeather: [collectCity, provideWeather],
      //getMood: collectMood
      //end: [untrained]
    }
  })
}
