import React from 'react'
import { useSelector } from 'react-redux'

import SnackBar from '../system/Snackbar'
import GlobalLoading from '../system/GlobalLoading'

import uiSelectors from '../../store/selectors/ui'
import dialogSelectors from '../../store/selectors/dialog'
import contentSelectors from '../../store/selectors/content'
import driveSelectors from '../../store/selectors/drive'
import unsplashSelectors from '../../store/selectors/unsplash'

import ConfirmDialog from './Confirm'
import ContentDialog from '../content/Dialog'
import DriveDialog from '../drive/Dialog'
import DrivePicker from '../drive/Picker'
import DriveUpgradeScopeDialog from '../system/DriveUpgradeRequestModal'
import ManageFoldersDialog from '../drive/ManageFoldersDialog'
import UnsplashDialog from '../unsplash/Dialog'
import SettingsDialog from '../settings/Dialog'
import PublishDialog from '../publish/PublishDialog'
import PublishSummaryDialog from '../publish/SummaryDialog'
import PublishHistoryDialog from '../publish/HistoryDialog'
import HelpDialog from '../system/HelpDialog'
import library from '../../library'

const dialogs = {
  settings: SettingsDialog,
  manageSectionFolders: ManageFoldersDialog,
  publish: PublishDialog,
  publishSummary: PublishSummaryDialog,
  publishHistory: PublishHistoryDialog,
  help: HelpDialog,
}

const DEFAULT_PARAMS = {}

const DialogLoader = ({
  
}) => {
  const loading = useSelector(uiSelectors.loading)
  const confirmWindow = useSelector(uiSelectors.confirmWindow)
  const formWindow = useSelector(contentSelectors.formWindow)
  const driveWindow = useSelector(driveSelectors.window)
  const drivePicker = useSelector(driveSelectors.picker)
  const driveUpgradeWindow = useSelector(driveSelectors.upgradeWindow)
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
        drivePicker && (
          <DrivePicker />
        )
      }
      {
        driveUpgradeWindow && (
          <DriveUpgradeScopeDialog />
        )
      }
      {
        unsplashWindow && (
          <UnsplashDialog />
        )
      }
      {
        library.autoSnackbar && (
          <SnackBar />
        )
      }
      <GlobalLoading
        loading={ loading }
      />
    </div>
  )
}

export default DialogLoader