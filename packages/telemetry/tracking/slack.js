const SlackBot = require('slackbots')
const tools = require('./tools')

const SLACK_TOKEN = process.env.SLACK_TOKEN
const SLACK_ENABLE = process.env.SLACK_ENABLE

const USERS_CHANNEL = 'nocode-users'
const EVENTS_CHANNEL = 'nocode-events'

let bot = null
let initParams = {}

const isActive = () => SLACK_TOKEN && SLACK_ENABLE ? true : false

const initialise = (params) => {
  initParams = params
  bot = new SlackBot({
    token: SLACK_TOKEN,
    name: 'Nocode Slack Bot',
  })
}

const identifyUser = (user) => {
  if(!bot) return
  user = tools.processUser(user)
  if(!user) return
  const {
    id,
    name,
    email,
  } = user
  bot.postMessageToChannel(USERS_CHANNEL, 'new user', {
    icon_emoji: ':nocode:',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `A new user (${id}) just registered:
 * name: ${name}
 * email: ${email}
`
        }
      },
    ]
  })

}

const trackEvent = (userid, name, params) => {
  if(!bot) return
  const props = Object.assign({}, initParams, params)
  const fields = Object
    .keys(props)
    .map(field => ` * ${field}: ${props[field]}`)
    .join("\n")
  bot.postMessageToChannel(EVENTS_CHANNEL, 'event', {
    icon_emoji: ':nocode:',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `A new event (${name}) just happened:
${fields}
`
        }
      },
    ]
  })
}

module.exports = {
  isActive,
  initialise,
  identifyUser,
  trackEvent,
}