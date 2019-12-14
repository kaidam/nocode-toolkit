import PaymentButton from './components/PaymentButtonMaterial'
import PaymentConfirmation from './components/PaymentConfirmationMaterial'
import plugin from './plugin'

const stripePluginMaterial = (opts = {}) => {
  const renderers = Object.assign({}, opts.renderers, {
    paymentButton: PaymentButton,
    paymentConfirmation: PaymentConfirmation,
  })
  opts = Object.assign({}, opts, {
    renderers,
  })
  return plugin(opts)
}

export default stripePluginMaterial