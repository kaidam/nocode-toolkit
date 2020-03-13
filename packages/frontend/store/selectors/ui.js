import { createSelector } from 'reselect'

import contentSelectors from './content'

const previewMode = state => state.ui.previewMode
const confirmWindow = state => state.ui.confirmWindow
const loading = state => state.ui.loading

const settings = contentSelectors.contentItem('settings')

const selectors = {
  previewMode,
  settings,
  confirmWindow,
  loading,
}

export default selectors
