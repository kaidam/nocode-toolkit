const NocodeBuild = require('@nocode-toolkit/builder/build')
const loggers = require('./loggers')

const Build = async ({
  options,
  logger,
}) => {
  const useOptions = Object.assign({}, options, {
    // we need this so built templates work on the live builder
    // 'loadable' will be replaced by the id of the website
    // being viewed
    baseUrl: '/builder/website/loadable/'
  })
  await NocodeBuild({
    options: useOptions,
    logger,
  })
  logger(loggers.success(`your code has compiled succesfully`))
}

module.exports = Build