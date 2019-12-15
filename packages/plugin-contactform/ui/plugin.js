import actions, { reducer } from './store'
import Schema from './schema'

const contactFormPlugin = (opts) => {
  return {
    id: 'contactform',
    title: 'Contact Form',
    actions,
    reducer,
    schema: Schema(opts),
  }
}

export default contactFormPlugin