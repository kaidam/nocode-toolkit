import SettingsConnect from './components/SettingsConnect'

const settingsTab = {
  initialValues: {
    stripe: {
      
    },
  },
  tabs: [{
    id: 'stripe',
    title: 'Stripe',
    schema: [{
      id: 'stripe.connectid',
      title: 'Connect Stripe Account',
      helperText: 'Connect your stripe account so you can take payments',
      component: SettingsConnect,
    }],
  }]
}

export default settingsTab