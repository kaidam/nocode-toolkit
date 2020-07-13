import React from 'react'
import { useSelector } from 'react-redux'

import SnackBar from '../system/Snackbar'

import uiSelectors from '../../store/selectors/ui'
import dialogSelectors from '../../store/selectors/dialog'
import contentSelectors from '../../store/selectors/content'
import layoutSelectors from '../../store/selectors/layout'
import driveSelectors from '../../store/selectors/drive'
import unsplashSelectors from '../../store/selectors/unsplash'

import ConfirmDialog from './Confirm'
import ContentDialog from '../content/Dialog'
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
  settings: SettingsDialog,
  publish: PublishDialog,
  publishSummary: PublishSummaryDialog,
  publishHistory: PublishHistoryDialog,
  help: HelpDialog,
}

const DEFAULT_PARAMS = {}

const DialogLoader = ({
  
}) => {
  const confirmWindow = useSelector(uiSelectors.confirmWindow)
  const formWindow = useSelector(contentSelectors.formWindow)
  const widgetWindow = useSelector(layoutSelectors.widgetWindow)
  const driveWindow = useSelector(driveSelectors.window)
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
        widgetWindow && (
          <AddWidgetDialog />
        ) 
      }
      {
        driveWindow && (
          <DriveDialog />
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
      <FormWindowDialog />
    </div>
  )
}

export default DialogLoader