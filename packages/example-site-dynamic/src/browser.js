import Render from '@nocode-toolkit/website-material-ui/src/browser'
import App from './app'
import reducers from './store/reducers'

const render = Render({
  reducers,
  App,
})

render()