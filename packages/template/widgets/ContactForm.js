import Render from '../components/contactform/Wrapper'
import icons from '../icons'

const form = [{
  id: 'contactform',
  title: 'Contact Form',
  schema: [
    
    {
      id: 'nameField',
      title: 'Name Field?',
      default: 'yesrequired',
      component: 'radio',
      helperText: 'Should a "name" field be included in the form?',
      row: true,
      options: [{
        title: 'Include',
        value: 'yes'
      }, {
        title: 'Include and make required',
        value: 'yesrequired'
      }, {
        title: 'Don\'t include',
        value: 'no'
      }]
    },

    {
      id: 'emailField',
      title: 'Email Field?',
      default: 'yesrequired',
      component: 'radio',
      helperText: 'Should an "email" field be included in the form?',
      row: true,
      options: [{
        title: 'Include',
        value: 'yes'
      }, {
        title: 'Include and make required',
        value: 'yesrequired'
      }, {
        title: 'Don\'t include',
        value: 'no'
      }]
    },

    {
      id: 'phoneField',
      title: 'Phone Field?',
      default: 'no',
      component: 'radio',
      helperText: 'Should a "phone" field be included in the form?',
      row: true,
      options: [{
        title: 'Include',
        value: 'yes'
      }, {
        title: 'Include and make required',
        value: 'yesrequired'
      }, {
        title: 'Don\'t include',
        value: 'no'
      }]
    },

    {
      id: 'commentsField',
      title: 'Comments Field?',
      default: 'no',
      component: 'radio',
      helperText: 'Should a "comments" field be included in the form?',
      row: true,
      options: [{
        title: 'Include',
        value: 'yes'
      }, {
        title: 'Include and make required',
        value: 'yesrequired'
      }, {
        title: 'Don\'t include',
        value: 'no'
      }]
    },

    {
      id: 'displayMode',
      title: 'Display Mode',
      default: 'inline',
      component: 'radio',
      helperText: 'How should we display the contact form?',
      row: true,
      options: [{
        title: 'Inline on the page',
        value: 'inline'
      }, {
        title: 'Open a Dialog Window',
        value: 'window'
      }]
    },

    {
      id: 'buttonTitle',
      title: 'Button Title',
      default: 'Contact Us',
      helperText: 'The title of the contact form submit button',
    },

    {
      id: 'webhookURL',
      title: 'Webhook URL',
      default: '',
      helperText: 'The URL to post each form submission to (e.g. a Zapier webhook)',
    },
  ],
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
  windowSize: 'md',
}