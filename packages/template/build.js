const NocodeBuild = require('@nocode-toolkit/builder/build')

const Build = ({
  options,
  logger,
}, done) => {
  const useOptions = Object.assign({}, options, {

    // we need this so built templates work on the live builder
    // 'loadable' will be replaced by the id of the website
    // being viewed
    baseUrl: '/builder/website/loadable/'
  })

  NocodeBuild({
    options: useOptions,
    logger,
  }, done)
}

module.exports = Build