'use strict'

exports.handle = (client) => {
  // Create steps
  const sayHello = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().helloSent)
    },

    prompt() {
      client.addResponse('welcome')
      client.addResponse('provide/documentation', {
        documentation_link: 'http://docs.init.ai',
      })
      client.addResponse('provide/instructions')

      client.updateConversationState({
        helloSent: true
      })

      client.done()
    }
  })

  const untrained = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('apology/untrained')
      client.done()
    }
  })

  const handleGreeting = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('greeting')
      client.done()
    }
  })

  const handleSorry = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('sorry')
      client.done()
    }
  })

  client.runFlow({
    classifications: {
      // map inbound message classifications to names of streams
      // Add a greeting handler with a reference to the greeting stream
      greeting: 'greeting'
      sorry: 'sorry'
    },
    autoResponses: {
      // configure responses to be automatically sent as predicted by the machine learning model
    },
    streams: {
      sorry: handleSorry,
      greeting: handleGreeting,
      main: 'onboarding',
      onboarding: [sayHello],
      end: [untrained],
    },
  })
}
