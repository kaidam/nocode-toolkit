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