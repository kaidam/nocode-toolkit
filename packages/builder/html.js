const utils = require('./utils')

const tags = {
  html: (helmet) => helmet ? `<html ${helmet.htmlAttributes.toString()}>` : '<html>',
  body: (helmet) => helmet ? `<body ${helmet.bodyAttributes.toString()}>` : '<body>',
  head: (helmet, baseUrl) => helmet ? tags.headHelmet(helmet, baseUrl) : tags.headPlain(baseUrl),
  headHelmet: (helmet, baseUrl) => `<head>
    <base href="${utils.processPath(baseUrl)}">
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    ${helmet.link.toString()}
    ${helmet.style.toString()}
    ${helmet.script.toString()}
    <style type="text/css">
      html,body,#_nocode_root {
        width: 100%;
        height: 100%;
        margin: 0px;
        padding: 0px;
      }
    </style>
  </head>
`,
  headPlain: (baseUrl) => `<head>
    <base href="${utils.processPath(baseUrl)}">
    <meta charSet="utf-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <style type="text/css">
      html,body,#_nocode_root {
        width: 100%;
        height: 100%;
        margin: 0px;
        padding: 0px;
      }
    </style>
  </head>
`
}

const getInitialState = (data) => {
  return data ? `
    <script type="text/javascript">
      window._nocodeInitialStateBase64 = '${new Buffer(JSON.stringify(data)).toString('base64')}'
    </script>
` : ''
}

const HTML = ({
  helmet,
  baseUrl,
  injectedHTML,
  bodyHtml,
  initialState,
  hash,
  cacheId,
  buildInfo,
}) => `
<!DOCTYPE html>
${ tags.html(helmet) }
  ${ tags.head(helmet, baseUrl) }
  ${ tags.body(helmet) }
  ${ injectedHTML || '' }
    <div id="_nocode_root">${ bodyHtml || '' }</div>
  ${ getInitialState(initialState) }
    <script type="text/javascript" src="_nocode_data.js?${ cacheId || hash || new Date().getTime() }"></script>
    <script type="text/javascript" src="${ buildInfo.appFilename }?${ cacheId || hash || new Date().getTime() }"></script>
  </body>
</html>
`

module.exports = HTML