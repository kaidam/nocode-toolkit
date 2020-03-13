import actions, { reducer } from './store'
import Cell from './cell'

const contactFormPlugin = (opts) => {
  return {
    id: 'contactform',
    title: 'Contact Form',
    description: 'Accept feedback from your website via email',
    actions,
    reducer,
    cell: Cell(opts),
  }
}

export default contactFormPlugin