import actions, { reducer } from './store'
import settingsTab from './settingsTab'
import schema from './schema'

const stripePlugin = {
  id: 'stripe',
  title: 'Stripe',
  actions,
  reducer,
  settingsTab,
  schema,
}

export default stripePlugin