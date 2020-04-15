import driveUtils from './drive'

const isFolder = (driver, item) => {
  if(driver == 'drive') return driveUtils.isFolder(item)
  return false
}

const utils = {
  isFolder,
}

export default utils