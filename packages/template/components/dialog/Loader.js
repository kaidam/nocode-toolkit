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

import SnackBar from '../system/Snackbar'
import GlobalLoading from '../system/GlobalLoading'

import uiSelectors from '../../store/selectors/ui'
import routerSelectors from '../../store/selectors/router'
import dialogSelectors from '../../store/selectors/dialog'
import contentSelectors from '../../store/selectors/content'
import driveSelectors from '../../store/selectors/drive'
import unsplashSelectors from '../../store/selectors/unsplash'

import ConfirmDialog from './Confirm'
import ContentDialog from '../content/Dialog'
import DriveDialog from '../drive/Dialog'
import UnsplashDialog from '../unsplash/Dialog'
import SettingsDialog from '../settings/Dialog'

const dialogs = {
  settings: SettingsDialog,
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
  const loading = useSelector(uiSelectors.loading)
  const confirmWindow = useSelector(uiSelectors.confirmWindow)
  const formWindow = useSelector(contentSelectors.formWindow)
  const driveWindow = useSelector(driveSelectors.window)
  const unsplashWindow = useSelector(unsplashSelectors.window)
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
          <ConfirmDialog />
        )
      }
      {
        formWindow && (
          <ContentDialog />
        ) 
      }
      {
        driveWindow && (
          <DriveDialog />
        )
      }
      {
        unsplashWindow && (
          <UnsplashDialog />
        )
      }
      <SnackBar />
      <GlobalLoading
        loading={ loading }
      />
    </div>
  )
}

export default DialogLoader