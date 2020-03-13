import actions, { reducer } from './store'
import settings from './settings'
import Cell from './cell'

const stripePlugin = (opts) => {
  return {
    id: 'stripe',
    title: 'Stripe',
    description: 'Take payments from your website paid directly into your Stripe account',
    actions,
    reducer,
    settings,
    cell: Cell(opts),
  }
}

export default stripePlugin