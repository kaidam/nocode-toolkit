const previewMode = state => state.ui.previewMode
const confirmWindow = state => state.ui.confirmWindow
const quickstartWindow = state => state.ui.quickstartWindow
const loading = state => state.ui.loading
const scrollToCurrentPage = state => state.ui.scrollToCurrentPage
const settingsOpen = state => state.ui.settingsOpen

const selectors = {
  previewMode,
  confirmWindow,
  quickstartWindow,
  loading,
  scrollToCurrentPage,
  settingsOpen,
}

export default selectors
