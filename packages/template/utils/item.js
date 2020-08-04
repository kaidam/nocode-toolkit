import driveUtils from './drive'

const isFolder = (driver, item) => {
  if(driver == 'drive') return driveUtils.isFolder(item)
  return false
}

// is this content directly attached to a section?
const isSectionContent = (node, locations) => {
  if(!node) return false
  const key = Object
    .keys(locations)
    .find(key => {
      const location = locations[key]
      return location.content_id == node.id
    })
  if(!key) return false
  return locations[key]
}

const utils = {
  isFolder,
  isSectionContent,
}

export default utils