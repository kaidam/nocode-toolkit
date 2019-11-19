const BASE_MIME_TYPE = 'application/vnd.google-apps.'

const FILE_TYPES = {
  folder: {
    editUrl: (id) => `https://drive.google.com/drive/folders/${id}`,
  },
  document: {
    editUrl: (id) => `https://docs.google.com/document/d/${id}/edit`,
  },
  spreadsheet: {
    editUrl: (id) => `https://docs.google.com/spreadsheets/d/${id}/edit`,
  },
  image: {
    editUrl: (id) => `https://drive.google.com/file/d/${id}/view`,
  },
  pdf: {
    editUrl: (id) => `https://drive.google.com/file/d/${id}/view`,
  },
  default: {
    editUrl: (id) => `https://drive.google.com/file/d/${id}/view`,
  }
}

// const reduce the mime type down to the single worded type
// e.g. application/vnd.google-apps.folder -> folder
// and image/jpeg -> image
const getBaseMimeType = (mimeType) => (mimeType || '')
  .replace(BASE_MIME_TYPE, '')
  .replace(/^image\/\w+$/, 'image')
  .replace(/^application\//, '')

const getEditUrl = (item) => {
  const baseMimeType = getBaseMimeType(item.mimeType)
  const typeDesc = FILE_TYPES[baseMimeType] || FILE_TYPES.default
  return typeDesc.editUrl(item.id)
}

const getGoogleLink = (url) => {
  return `https://accounts.google.com/ServiceLoginAuth?continue=${url}`
}

const getFolderLink = (id) => {
  return `https://drive.google.com/drive/folders/${id}`
}

const getDocumentLink = (id) => {
  return `https://docs.google.com/document/d/${id}/edit`
}

const getItemIcon = (item) => {
  return item.iconLink ?
    item.iconLink.replace(/\/16\//, '/32/') :
    null
}

const getItemThumbnail = (item) => {
  return item.hasThumbnail && item.thumbnailLink ?
    item.thumbnailLink :
    null
}

const isFolder = (item) => {
  return item.mimeType == 'application/vnd.google-apps.folder'
}

const isImage = (item) => {
  const baseMimeType = getBaseMimeType(item.mimeType)
  return baseMimeType == 'image'
}

const getItemUrl = (item) => {
  const itemUrl = isFolder(item) ?
    getFolderLink(item.id) :
    getDocumentLink(item.id)
  return getGoogleLink(itemUrl)
}

const openItem = (item) => {
  window.open(getItemUrl(item))
}

const driver = {
  getItemUrl,
  openItem,
  isFolder,
  isImage,
  getItemIcon,
  getFolderLink,
  getDocumentLink,
  getGoogleLink,
  getItemThumbnail,
  getEditUrl,
}

export default driver