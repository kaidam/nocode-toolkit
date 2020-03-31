import actions, { reducer } from './store'
import settings from './settings'
import widget from './widget'

const stripePlugin = (opts = {}) => {
  return {
    id: 'stripe',
    title: 'Stripe',
    description: 'Take payments from your website paid directly into your Stripe account',
    actions,
    reducer,
    settings,
    widgets: [widget],
  }
}

export default stripePlugin