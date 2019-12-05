import settingsTab from './settingsTab'
import actions, { reducer } from './store'

const stripePlugin = {
  id: 'stripe',
  title: 'Stripe',
  actions,
  reducer,
  settingsTab,
}

export default stripePlugin