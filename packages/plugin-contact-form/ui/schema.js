import React from 'react'
import Wrapper from './components/Wrapper'

const Schemas = ({
  renderers = {},
} = {}) => {
  const contactForm = {
    driver: 'local',
    type: 'contactForm',
    title: 'Contact Form',
    icon: 'contact',
    metadata: {},
    parentFilter: ['cell'],
    initialValues: {
      emailAddress: '',
      buttonTitle: '',
    },
    schema: [{
      id: 'buttonTitle',
      title: 'Button Title',
      helperText: 'The title of the contact form button',
    }],
    cellConfig: {
      padding: 1,
      component: (props) => {
        return (
          <Wrapper
            renderers={ renderers }
            {...props}
          />
        )
      },
    },
  }

  return {
    contactForm,
  }
}

export default Schemas