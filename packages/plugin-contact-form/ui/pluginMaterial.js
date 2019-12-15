import Button from './components/MaterialButton'
import FormDialog from './components/MaterialFormDialog'
import plugin from './plugin'

const contactFormPluginMaterial = (opts = {}) => {
  const renderers = Object.assign({}, opts.renderers, {
    button: Button,
    formDialog: FormDialog,
  })
  return plugin(Object.assign({}, opts, {
    renderers,
  }))
}

export default contactFormPluginMaterial