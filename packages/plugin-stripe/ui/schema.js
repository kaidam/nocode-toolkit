import React from 'react'

const paymentButton = {
  driver: 'local',
  type: 'paymentButton',
  title: 'Payment Button',
  icon: 'payment',
  metadata: {},
  parentFilter: ['cell'],
  initialValues: {
    name: '',
    price: 0,
    currency: '',
    description: '',
  },
  schema: [{
    id: 'name',
    title: 'Product Name',
    helperText: 'Enter the name of the product',
    validate: {
      type: 'string',
      methods: [
        ['required', 'The name is required'],
      ],
    }
  },[{
    id: 'price',
    title: 'Price',
    helperText: 'Enter the price for the product',
    inputProps: {
      type: 'number',
    },
    validate: {
      type: 'number',
      methods: [
        ['required', 'The price is required'],
      ],
    }
  },{
    id: 'currency',
    title: 'Currency',
    helperText: 'Enter the currency',
    component: 'select',
    options: [{
      title: 'GBP (£)',
      value: 'GBP',
    },{
      title: 'USD ($)',
      value: 'USD',
    }],
    validate: {
      type: 'string',
      methods: [
        ['required', 'The currency is required'],
      ],
    }
  }],{
    id: 'buttonTitle',
    title: 'Button Title',
    helperText: 'Enter the title of the purchase button',
  },{
    id: 'description',
    title: 'Description',
    helperText: 'Enter a description for the product',
    component: 'textarea',
    validate: {
      type: 'string',
      methods: [
        ['required', 'The description is required'],
      ],
    }
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