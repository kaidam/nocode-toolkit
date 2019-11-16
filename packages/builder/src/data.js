/*

  get the script version of items and routes that is loaded from the
  /_nocode_data.js route - this is:

   * served from the devserver in development
   * written to a static file in publish

  opts:

   * routes
   * items - only passed in dev mode - in production the items are baked into
   the initial state rendered on the server
   * config - system configuration
     * externalsUrl - where to load the externals from

*/
const factory = ({
  // this comes from the plugin context
  config,
  // this is injected by the publisher
  extraConfig,
  items,
  routes,
}) => {
  const data = {
    routes,
    config: Object.assign({}, config, extraConfig),
  }
  if(items) data.items = items
  return data
}

const script = (data) => {
  return `window._nocodeData = ${ JSON.stringify(data) }`
}

const processInitialState = (initialState) => {
  
  // these are loaded from the data script meaning all pages
  // don't have a copy of the entire item database
  initialState.nocode.items = {}

  // this is loaded from the data script because that is written
  // in browser context
  initialState.nocode.config = {}

  // these are present in the data script - no need to duplicate
  // them onto each page
  initialState.nocode.routes = {}

  return initialState
}

const data = {
  factory,
  script,
  processInitialState,
}

module.exports = data