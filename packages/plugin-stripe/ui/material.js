import PaymentButton from './components/MaterialButton'
import PaymentConfirmation from './components/MaterialConfirmation'
import plugin from './plugin'

const stripePluginMaterial = (opts = {}) => {
  const renderers = Object.assign({}, opts.renderers, {
    button: PaymentButton,
    confirmation: PaymentConfirmation,
  })
  return plugin(Object.assign({}, opts, {
    renderers,
  }))
}

export default stripePluginMaterial