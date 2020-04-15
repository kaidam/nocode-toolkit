const previewMode = state => state.ui.previewMode
const confirmWindow = state => state.ui.confirmWindow
const loading = state => state.ui.loading
const scrollToCurrentPage = state => state.ui.scrollToCurrentPage

const selectors = {
  previewMode,
  confirmWindow,
  loading,
  scrollToCurrentPage,
}

export default selectors
