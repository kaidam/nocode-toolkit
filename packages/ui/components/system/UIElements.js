import React from 'react'
import { useSelector } from 'react-redux'

/*

  keep all of the UI components in a single wrapper so we only need to import a single component

*/
import selectors from '../../store/selectors'
import ContentFormDialog from '../content/Dialog'
import SettingsDialog from './SettingsDialog'
import FinderDialog from '../finder/Dialog'
import JobDialog from '../job/Dialog'
import JobHistoryDialog from '../job/HistoryDialog'
import JobPublishedDialog from '../job/PublishedDialog'
import JobLoading from '../job/Loading'
import ConfirmDialog from './ConfirmDialog'
import HelpDialog from './HelpDialog'
import SnackBar from './Snackbar'

const dialogs = {
  contentForm: ContentFormDialog,
  settings: SettingsDialog,
  finder: FinderDialog,
  jobStatus: JobDialog,
  jobHistory: JobHistoryDialog,
  jobPublished: JobPublishedDialog,
  confirm: ConfirmDialog,
  help: HelpDialog,
}

const UIElements = ({
  
}) => {
  const confirmWindow = useSelector(state => state.ui.confirmWindow)
  let { dialog } = useSelector(selectors.router.queryParams)

  if(confirmWindow) dialog = 'confirm'

  const DialogComponent = dialog ? dialogs[dialog] : null

  return (
    <div>
      {
        DialogComponent && <DialogComponent />
      }
      <SnackBar />
      <JobLoading />
    </div>
  )
}

export default UIElements