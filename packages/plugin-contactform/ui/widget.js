import Render from './components/Wrapper'

const form = {
  id: 'contactform',
  title: 'Contact Form',
  initialValues: {
    buttonTitle: '',
  },
  schema: [{
    id: 'buttonTitle',
    title: 'Button Title',
    helperText: 'The title of the contact form button',
  }],
}

const widget = {
  id: 'contactform',
  title: 'Contact Form',
  Render,
  form,
}

export default widget