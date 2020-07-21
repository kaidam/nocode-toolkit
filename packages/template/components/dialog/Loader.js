import React from 'react'

import SnackBar from '../system/Snackbar'
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

const DialogLoader = ({
  
}) => {
  return (
    <>
      <PublishDialog />
      <PublishSummaryDialog />
      <PublishHistoryDialog />
      <DriveUpgradeScopeDialog />
      <ConfirmDialog />
      <DriveDialog />
      <SettingsDialog />
      <AddWidgetDialog />
      <FormWindowDialog />
      <UnsplashDialog />
      <HelpDialog />
      {
        library.autoSnackbar && (
          <SnackBar />
        )
      }
    </>
  )
}

export default DialogLoader