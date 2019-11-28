import Server from '@nocode-toolkit/website/server'
import { ServerStyleSheets } from '@material-ui/styles'

const ServerMaterial = ({
  reducers,
  App,
}) => {

  const coreServer = Server({
    reducers,
    App,
  })

  const handler = ({
    route,
    globals,
    errorLog,
  }, done) => {

    coreServer({
      route,
      globals,
      errorLog,
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
    }, done)
  }

  return handler 
}

export default ServerMaterial