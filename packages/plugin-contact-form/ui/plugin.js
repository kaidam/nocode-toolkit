import actions, { reducer } from './store'
import Schema from './schema'

const contactFormPlugin = (opts) => {
  return {
    id: 'contact-form',
    title: 'Contact Form',
    actions,
    reducer,
    schema: Schema(opts),
  }
}

export default contactFormPlugin