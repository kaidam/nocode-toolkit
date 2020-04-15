import Server from './index'
import { ServerStyleSheets } from '@material-ui/styles'

const ServerMaterial = ({
  reducers,
  App,
}) => Server({
  reducers,
  App,
  render: ({
    appElem,
  }) => {
    const sheets = new ServerStyleSheets()
    const bodyHtml = Server.renderToString(
      sheets.collect(appElem)
    )
    const injectedHTML = `<style id="jss-server-side">${sheets.toString()}</style>`
    return {
      bodyHtml,
      injectedHTML,
    }
  },
})

export default ServerMaterial