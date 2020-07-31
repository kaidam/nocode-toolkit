import Render from '../components/ecommerce/Wrapper'
import icons from '../icons'
import ecommerceSelectors from '../store/selectors/ecommerce'

const form = [{
  id: 'ecommerce',
  title: 'Payment Button',
  schema: [{
    id: 'name',
    title: 'Product Name',
    helperText: 'Enter the name of the product',
    default: '',
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
    default: 0,
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
    default: '',
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
    default: '',
    helperText: 'Enter the title of the purchase button',
  },{
    id: 'description',
    title: 'Description',
    default: '',
    helperText: 'Enter a description for the product',
    component: 'textarea',
    validate: {
      type: 'string',
      methods: [
        ['required', 'The description is required'],
      ],
    }
  }],
}]

export default {
  id: 'ecommerce',
  title: 'Ecommerce Button',
  description: 'Allow visitors to purchase things from your website',
  Render,
  locations: ['document', 'section'],
  feature: 'ecommerce',
  group: 'Plugins',
  form,
  icon: icons.shopping,
  addHandler: (getState) => {
    const connection = ecommerceSelectors.stripeConnectData(getState())
    if(connection && connection.connected) return true
    return {
      title: 'Connect your stripe account',
      message: `
<p>So you can add ecommerce buttons, we need you to connect your Stripe account so you can get paid.<p>
<p>Click the website settings button (top right) and click "ecommerce" to connect your stripe account</p>          
`
    }
  },
}