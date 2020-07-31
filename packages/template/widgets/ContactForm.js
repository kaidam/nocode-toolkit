import Render from '../components/contactform/Wrapper'
import icons from '../icons'

const form = [{
  id: 'contactform',
  title: 'Contact Form',
  schema: [{
    id: 'buttonTitle',
    title: 'Button Title',
    default: '',
    helperText: 'The title of the contact form button',
  }],
}]

export default {
  id: 'contactform',
  title: 'Contact Form',
  description: 'Show a form visitors can use to get in touch',
  Render,
  locations: ['document', 'section'],
  feature: 'forms',
  group: 'Plugins',
  form,
  icon: icons.contact,
}