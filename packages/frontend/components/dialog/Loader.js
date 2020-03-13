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
import dialogSelectors from '../../store/selectors/dialog'

const dialogs = {
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

const DEFAULT_PARAMS = {}

const DialogLoader = ({
  
}) => {
  const confirmWindow = useSelector(uiSelectors.confirmWindow)
  const dialogParams = useSelector(dialogSelectors.dialogParams)

  return (
    <div>
      {
        Object
          .keys(dialogs)
          .filter(name => dialogParams[name] && dialogParams[name].open ? true : false)
          .map((name, i) => {
            const DialogComponent = dialogs[name]
            const params = dialogParams[name] || DEFAULT_PARAMS
            return (
              <DialogComponent
                key={ i }
                {...params}
              />
            )
          })
      }
      {
        confirmWindow && (
          <ConfirmWindow />
        )
      }
      <SnackBar />
      <GlobalLoading />
    </div>
  )
}

export default DialogLoader