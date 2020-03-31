import Render from './components/Wrapper'

const form = {
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
  Render,
  form,
}

export default widget