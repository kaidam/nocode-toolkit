const previewMode = state => state.ui.previewMode
const confirmWindow = state => state.ui.confirmWindow
const loading = state => state.ui.loading
const scrollToCurrentPage = state => state.ui.scrollToCurrentPage
const settingsOpen = state => state.ui.settingsOpen
const formWindow = state => state.ui.formWindow

const selectors = {
  previewMode,
  confirmWindow,
  loading,
  scrollToCurrentPage,
  settingsOpen,
  formWindow,
}

export default selectors
