import actions, { reducer } from './store'
import widget from './widget'

const contactFormPlugin = (opts = {}) => {
  return {
    id: 'contactform',
    title: 'Contact Form',
    description: 'Accept feedback from your website via email',
    actions,
    reducer,
    widgets: [widget],
  }
}

export default contactFormPlugin