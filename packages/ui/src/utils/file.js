const baseMimeType = 'application/vnd.google-apps.'
const baseIconUrl = 'https://ssl.gstatic.com/docs/doclist/images/mediatype'
const baseThumbnailUrl = 'https://drive.google.com/thumbnail?id='

const settings = {
  baseMimeType,
  baseIconUrl,
  baseThumbnailUrl,
  allChildTypes: 'folder,document,spreadsheet,image,pdf',
  fileTypes: {
    folder: {
      title: 'Folder',
      mimeType: `${baseMimeType}folder`,
      editUrl: (id) => `https://drive.google.com/drive/folders/${id}`,
    },
    document: {
      title: 'Document',
      mimeType: `${baseMimeType}document`,
      editUrl: (id) => `https://docs.google.com/document/d/${id}/edit`,
    },
    spreadsheet: {
      title: 'Spreadsheet',
      mimeType: `${baseMimeType}spreadsheet`,
      editUrl: (id) => `https://docs.google.com/spreadsheets/d/${id}/edit`,
    },
    image: {
      title: 'Image',
      iconType: 'image',
      isUpload: true,
      uploadAccept: 'image/jpeg, image/png, image/gif',
      mimeType: (filename) => {
        if(!filename) return 'image'
        const parts = filename.split('.')
        let ext = parts[parts.length-1]
        if(ext == 'jpg') ext = 'jpeg'
        return `image/${ext}`
      },
      editUrl: (id) => `https://drive.google.com/file/d/${id}/view`,
    },
    pdf: {
      title: 'PDF',
      iconType: 'pdf',
      isUpload: true,
      uploadAccept: 'application/pdf',
      mimeType: 'application/pdf',
      editUrl: (id) => `https://drive.google.com/file/d/${id}/view`,
    },
  },
}

const getFileSettings = (type) => settings.fileTypes[type] || {}
const stripMimeType = (mimeType) => 
  (mimeType || '')
    .replace(settings.baseMimeType, '')
    .replace(/^image\/\w+$/, 'image')
    .replace(/^application\//, '')

const getMimeTypeTitle = (mimeType) => getFileSettings(stripMimeType(mimeType)).title
const getFullMimeType = (mimeType, filename) => {
  const typeHandler = getFileSettings(stripMimeType(mimeType)).mimeType
  if(typeof(typeHandler) == 'string') return typeHandler
  if(typeof(typeHandler) == 'function') return typeHandler(filename)
  return null
}

const getEditUrl = (mimeType) =>  getFileSettings(stripMimeType(mimeType)).editUrl
const isUploadType = (mimeType) => getFileSettings(stripMimeType(mimeType)).isUpload ? true : false
const getUploadAccept = (mimeType) => getFileSettings(stripMimeType(mimeType)).uploadAccept
const getIconType = (mimeType) =>  {
  const baseType = stripMimeType(mimeType)
  return getFileSettings(baseType).iconType || baseType
}

const getIconUrl = (mimeType, size = 32) => {
  const baseType = stripMimeType(mimeType)
  return `${settings.baseIconUrl}/icon_1_${getIconType(baseType)}_x${size}.png`
}

const getThumbnailUrl = (id) => `${settings.baseThumbnailUrl}${id}`

const sortFilesByName = (a, b) => {
  const aName = a.name.toLowerCase()
  const bName = b.name.toLowerCase()
  if(aName > bName) return 1
  else if(bName > aName) return -1
  else return 0
}

const isFolder = (file) => stripMimeType(file.mimeType) == 'folder'
const canOpenInline = (file) => {
  const type = stripMimeType(file.mimeType)
  return type == 'document' || type == 'spreadsheet'
}

const sortFiles = (files) => {
  const folders = files.filter(file => isFolder(file))
  const other = files.filter(file => !isFolder(file))
  folders.sort(sortFilesByName)
  other.sort(sortFilesByName)
  return folders.concat(other)
}

const getDriveUrl = (id, mimeType) => {
  const editUrl = getEditUrl(mimeType)
  if(!editUrl) return
  return editUrl(id)
}

const fileUtils = {
  stripMimeType,
  getIconUrl,
  getThumbnailUrl,
  getMimeTypeTitle,
  getFullMimeType,
  isUploadType,
  getUploadAccept,
  sortFiles,
  isFolder,
  canOpenInline,
  getDriveUrl,
}

export default fileUtils