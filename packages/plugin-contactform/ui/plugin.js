import actions, { reducer } from './store'
import Schema from './schema'

const contactFormPlugin = (opts) => {
  return {
    id: 'contactform',
    title: 'Contact Form',
    description: 'Accept feedback from your website via email',
    actions,
    reducer,
    schema: Schema(opts),
  }
}

export default contactFormPlugin