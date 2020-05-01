const previewMode = state => state.ui.previewMode
const confirmWindow = state => state.ui.confirmWindow
const quickstartWindow = state => state.ui.quickstartWindow
const loading = state => state.ui.loading
const scrollToCurrentPage = state => state.ui.scrollToCurrentPage

const selectors = {
  previewMode,
  confirmWindow,
  quickstartWindow,
  loading,
  scrollToCurrentPage,
}

export default selectors
