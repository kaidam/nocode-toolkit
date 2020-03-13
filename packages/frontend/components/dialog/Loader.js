import React from 'react'
import { useSelector } from 'react-redux'

// import ContentFormDialog from '../content/Dialog'
// import SettingsDialog from './SettingsDialog'
// import FinderDialog from '../finder/Dialog'
// import JobDialog from '../job/Dialog'
// import JobHistoryDialog from '../job/HistoryDialog'
// import JobPublishedDialog from '../job/PublishedDialog'
// import ConfirmDialog from './ConfirmDialog'
// import HelpDialog from './HelpDialog'

import ConfirmWindow from './Confirm'
import SettingsWindow from './Settings'

import SnackBar from '../system/Snackbar'
import GlobalLoading from '../system/GlobalLoading'

import uiSelectors from '../../store/selectors/ui'
import routerSelectors from '../../store/selectors/router'

const windows = {
  confirm: ConfirmWindow,
  settings: SettingsWindow,
  // contentForm: ContentFormDialog,
  // settings: SettingsDialog,
  // finder: FinderDialog,
  // jobStatus: JobDialog,
  // jobHistory: JobHistoryDialog,
  // jobPublished: JobPublishedDialog,
  // confirm: ConfirmDialog,
  // help: HelpDialog,
}

const Windows = ({
  
}) => {
  const confirmWindow = useSelector(uiSelectors.confirmWindow)
  let { window } = useSelector(routerSelectors.queryParams)

  const WindowComponent = windows ? windows[window] : null

  return (
    <div>
      {
        WindowComponent && <WindowComponent />
      }
      {
        confirmWindow && window != 'confirm' && (
          <ConfirmWindow />
        )
      }
      <SnackBar />
      <GlobalLoading />
    </div>
  )
}

export default Windows