import SettingsConnect from './components/SettingsConnect'

const settingsTab = {
  initialValues: {
    stripe: {
      
    },
  },
  schema: [{
    id: 'stripe.connectid',
    title: 'Connect Stripe Account',
    helperText: 'Connect your stripe account so you can take payments',
    component: SettingsConnect,
  }],
}

export default settingsTab