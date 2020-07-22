import systemUtils from './utils/system'

export const API = '/api/v1'
export const GOOGLE_FULL_DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive'
export const GOOGLE_LOGIN = '/api/v1/auth/google'
export const GOOGLE_UPGRADE_LOGIN = systemUtils.isNode ?
  '' :
  `${window.location.host == 'localhost:8000' ? 'http://localhost' : ''}/api/v1/auth/google_upgrade`

// how much time do we wait before checking again
// for new content once the window is focused
export const GOOGLE_DOUBLE_BUBBLE_RELOAD_DELAY = 5000

export const LOGOUT_URL = 'https://nocode.works'

export const RELOAD_APP_JOBS = [
  'createPreview',
  'addContent',
  'updateContent',
  'removeContent',
]

export const SEARCH_DELAY = 1000

export const DEFAULT_LAYOUT = [[{type: 'documentContent'}]]
export const DEFAULT_CELL_SETTINGS = {
  horizontal_align: 'left',
  vertical_align: 'top',
  padding: 8,
}
