import React from 'react'
import Button from './components/Button'

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
    id: 'emailAddress',
    title: 'Email Address',
    helperText: 'Where do contact form emails get sent?',
    validate: {
      type: 'string',
      methods: [
        ['required', 'The email address is required'],
      ],
    }
  },{
    id: 'buttonTitle',
    title: 'Button Title',
    helperText: 'The title of the contact form button',
  }],
  cellConfig: {
    padding: 1,
    component: ({
      content,
      cell,
      rowIndex,
      cellIndex,
    }) => {
      return (
        <PaymentButtonWrapper
          content={ content }
          cell={ cell }
          rowIndex={ rowIndex }
          cellIndex={ cellIndex }
          Renderer={ PaymentButtonRender }
          ConfirmRenderer={ PaymentConfirmationRender }
        />
      )
    },
  },
  // we should not show the payment button if
  // there is not a connected stripe account
  addCellFilter: (settings) => {
    if(!settings || !settings.data || !settings.data.stripe) return false
    return settings.data.stripe.connected ? true : false
  },
}

const schemas = {
  paymentButton,
}

export default schemas