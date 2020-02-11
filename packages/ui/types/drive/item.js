import utils from './utils'

const hasChildren = (item) => item.type == 'folder'
const hasRoute = (item) => item.type == 'document'
const iconName = (item) => {
  return hasChildren(item) ?
    'folder' :
    'document'
}
const isGhostDescendant = (item) => item.location.ghostParent ? true : false

// root content if the item id is the same as the item content_id
const isRootContent = (item) => item.id == item.content_id

const getItemUrl = (item) => {
  const itemUrl = hasChildren(item) ?
    utils.getFolderLink(item.id) :
    utils.getDocumentLink(item.id)
  return utils.getGoogleLink(itemUrl)
}

const handleOpen = item => {
  window.open(getItemUrl(item))
}

const itemType = {
  hasChildren,
  hasRoute,
  iconName,
  isGhostDescendant,
  isRootContent,
  isEditable: item => false,
  isOpenable: item => true,
  driverName: item => 'Google Drive',
  handleOpen,
}

export default itemType