import React from 'react'
import PaymentButton from './components/PaymentButton'
import PaymentConfirmation from './components/PaymentConfirmation'
import PaymentButtonWrapper from './components/PaymentButtonWrapper'

const Schemas = ({
  renderers = {},
} = {}) => {
  const PaymentButtonRender = renderers.paymentButton || PaymentButton
  const PaymentConfirmationRender = renderers.paymentConfirmation || PaymentConfirmation
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

  return schemas
}

export default Schemas