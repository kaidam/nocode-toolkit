import Render from '@nocode-toolkit/website-material-ui/lib/browser'
import App from './app'
import reducers from './store/reducers'

const render = Render({
  reducers,
  App,
})

render()