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

const bold = (value) => {
  if(!value) return
  if(value.toString().match(/^http/i)) return value
  return `*${value}*`
}

const getMessageBlock = (title, props) => {

  const imageField = Object.keys(props).find(field => field.indexOf('_image_') == 0)

  const fieldString = Object
    .keys(props)
    .filter(field => props[field] ? true : false)
    .filter(field => field.indexOf('_image_') == 0 ? false : true)
    .map(field => ` -> ${field}: ${bold(props[field])}`)
    .join("\n")

  const block = {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `${title}\n${fieldString}`,
    },
  }

  if(imageField) {
    block.accessory = {
      type: 'image',
      image_url: props[imageField],
      alt_text: imageField,
    }
  }

  return block
}

// opts can contain "existing"
const identifyUser = (user, opts) => {
  if(!bot) return
  user = tools.processUser(user)
  if(!user) return
  if(opts && opts.existing) return
  const {
    id,
    name,
    email,
  } = user

  bot.postMessageToChannel(USERS_CHANNEL, 'new user', {
    icon_emoji: ':nocode:',
    blocks: [
      getMessageBlock(`*new user*:`, {
        id,
        name,
        email,
      }),
      {
        "type": "divider"
      },
    ]
  })
}

const trackEvent = (userid, name, params) => {
  if(!bot) return
  const fields = Object.assign({}, initParams, params)
  bot.postMessageToChannel(EVENTS_CHANNEL, 'event', {
    icon_emoji: ':nocode:',
    blocks: [
      getMessageBlock(`*${name}*`, fields),
      {
        "type": "divider"
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