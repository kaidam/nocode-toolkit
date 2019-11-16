import isNode from 'detect-node'

const routePathToName = (path) => {
  const name = path
    .replace(/^\//, '')
    .replace(/\//g, '-')
  return name || 'root'
}

const sanitizeRoute = (path) => path.replace(/\/+/g, '/')

const utils = {
  routePathToName,
  sanitizeRoute,
  isNode,
}

export default utils
