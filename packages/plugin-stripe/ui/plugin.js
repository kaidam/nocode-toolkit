import actions, { reducer } from './store'
import settingsTab from './settingsTab'
import Schema from './schema'

const stripePlugin = (opts) => {
  return {
    id: 'stripe',
    title: 'Stripe',
    description: 'Take payments from your website paid directly into your Stripe account',
    actions,
    reducer,
    settingsTab,
    schema: Schema(opts),
  }
}

export default stripePlugin