import React from 'react'

const paymentButton = {
  driver: 'local',
  type: 'paymentButton',
  title: 'Payment Button',
  icon: 'payment',
  metadata: {},
  parentFilter: ['cell'],
  initialValues: {
    title: '',
  },
  schema: [{
    id: 'title',
    title: 'title',
    helperText: 'Enter the text for the title',
  }],
  cellConfig: {
    component: () => (<div>payment button</div>),
    padding: 1,
  },
}

const schemas = {
  paymentButton,
}

export default schemas