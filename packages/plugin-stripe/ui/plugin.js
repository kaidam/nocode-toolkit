import actions, { reducer } from './store'
import settingsTab from './settingsTab'
import Schema from './schema'

const stripePlugin = (opts) => {
  return {
    id: 'stripe',
    title: 'Stripe',
    actions,
    reducer,
    settingsTab,
    schema: Schema(opts),
  }
}

export default stripePlugin