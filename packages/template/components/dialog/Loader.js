import React from 'react'
import { useSelector } from 'react-redux'

import SnackBar from '../system/Snackbar'
import dialogSelectors from '../../store/selectors/dialog'

import ConfirmDialog from './Confirm'
import FormWindowDialog from '../ui/FormWindow'
import AddWidgetDialog from '../layout/AddWidgetDialog'
import DriveDialog from '../drive/Dialog'
import DriveUpgradeScopeDialog from '../system/DriveUpgradeRequestModal'
import UnsplashDialog from '../unsplash/Dialog'
import SettingsDialog from '../settings/Dialog'
import PublishDialog from '../publish/PublishDialog'
import PublishSummaryDialog from '../publish/SummaryDialog'
import PublishHistoryDialog from '../publish/HistoryDialog'
import HelpDialog from '../system/HelpDialog'
import library from '../../library'

const dialogs = {
  publish: PublishDialog,
  publishSummary: PublishSummaryDialog,
  publishHistory: PublishHistoryDialog,
  help: HelpDialog,
}

const DEFAULT_PARAMS = {}

const DialogLoader = ({
  
}) => {
  
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
      <DriveUpgradeScopeDialog />
      <ConfirmDialog />
      <DriveDialog />
      <SettingsDialog />
      <AddWidgetDialog />
      <FormWindowDialog />
      <UnsplashDialog />
      {
        library.autoSnackbar && (
          <SnackBar />
        )
      }
    </div>
  )
}

export default DialogLoader