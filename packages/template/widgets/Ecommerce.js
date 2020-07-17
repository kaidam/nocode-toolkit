import Render from '../components/ecommerce/Wrapper'
import icons from '../icons'

const form = {
  id: 'ecommerce',
  title: 'Payment Button',
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
}

export default {
  id: 'ecommerce',
  title: 'Ecommerce Button',
  description: 'Allow visitors to purchase things from your website',
  Render,
  locations: ['document', 'section'],
  group: 'Plugins',
  form,
  icon: icons.shopping,
}