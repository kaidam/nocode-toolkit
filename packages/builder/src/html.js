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
  </head>
`,
  headPlain: (baseUrl) => `<head>
    <base href="${utils.processPath(baseUrl)}">
    <meta charSet="utf-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  </head>
`
}

const getInitialState = (data) => {
  return data ? `
    <script type="text/javascript">
      window._nocodeInitialState = ${ JSON.stringify(data) }
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
  buildInfo,
}) => `
<!DOCTYPE html>
${ tags.html(helmet) }
  ${ tags.head(helmet, baseUrl) }
  ${ tags.body(helmet) }
  ${ injectedHTML || '' }
    <div id="_nocode_root">${ bodyHtml || '' }</div>
  ${ getInitialState(initialState) }
    <script type="text/javascript" src="_nocode_data.js?${ hash || new Date().getTime() }"></script>
    <script type="text/javascript" src="${ buildInfo.appFilename }?${ hash || new Date().getTime() }"></script>
  </body>
</html>
`

module.exports = HTML