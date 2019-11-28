import Server from '@nocode-toolkit/ui/Server'
import reducers from '@nocode-toolkit/ui/store/reducers'
import App from './app'

const server = Server({
  reducers,
  App,
})

export default server