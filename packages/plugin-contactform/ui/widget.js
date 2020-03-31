import Render from './components/Wrapper'

const form = {
  id: 'contactform',
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
  Render,
  form,
}

export default widget