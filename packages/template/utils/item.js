import driveUtils from './drive'

const isFolder = (driver, item) => {
  if(driver == 'drive') return driveUtils.isFolder(item)
  return false
}

// is this content directly attached to a section?
const isSectionContent = (node, locations) => {
  if(!node) return false
  const locationId = node.route ? `${node.route.location}:${node.id}` : null
  return locationId && locations[locationId] ? true : false
}

const utils = {
  isFolder,
  isSectionContent,
}

export default utils