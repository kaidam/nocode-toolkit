import actions, { reducer } from './store'
import schema from './schema'

const contactFormPlugin = (opts) => {
  return {
    id: 'contact-form',
    title: 'Contact Form',
    actions,
    reducer,
    settingsTab,
    schema,
  }
}

export default contactFormPlugin