import React from 'react'
import { useSelector } from 'react-redux'

/*

  keep all of the UI components in a single wrapper so we only need to import a single component

*/
import selectors from '../../store/selectors'
import ContentFormDialog from '../content/Dialog'
import ExternalEditorDialog from '../layout/ExternalEditorDialog'
import FinderDialog from '../finder/Dialog'
import JobDialog from '../job/Dialog'
import JobHistoryDialog from '../job/HistoryDialog'
import JobPublishedDialog from '../job/PublishedDialog'
import ConfirmDialog from './ConfirmDialog'
import SnackBar from './Snackbar'

const dialogs = {
  contentForm: ContentFormDialog,
  externalEditor: ExternalEditorDialog,
  finder: FinderDialog,
  jobStatus: JobDialog,
  jobHistory: JobHistoryDialog,
  jobPublished: JobPublishedDialog,
  confirm: ConfirmDialog,
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
    </div>
  )
}

export default UIElements