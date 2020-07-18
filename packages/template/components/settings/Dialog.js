import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Window from '../dialog/Window'
import WebsiteSettingsRender from '../website/Settings'

import websiteSelectors from '../../store/selectors/website'
import settingsSelectors from '../../store/selectors/settings'
import settingsActions from '../../store/modules/settings'

import icons from '../../icons'

const SettingsDialog = ({

}) => {

  const dispatch = useDispatch()
  const websiteId = useSelector(websiteSelectors.websiteId)
  const windowOpen = useSelector(settingsSelectors.windowOpen)
  const onCloseWindow = useCallback(() => {
    dispatch(settingsActions.closeDialog())
  }, [])

  const onOpenPlan = useCallback(() => {
    const loc = document.location
    document.location = `${loc.protocol}//${loc.hostname}/website/edit/${websiteId}?section=plan`
  }, [
    websiteId,
  ])

  return (
    <Window
      open={ windowOpen ? true : false }
      compact
      noScroll
      noActions
      size="lg"
      fullHeight
      onCancel={ onCloseWindow }
    >
      <WebsiteSettingsRender
        cancelTitle="Close"
        buttonAlign="left"
        extraTabs={ [{
          id: 'plan',
          title: 'Plan',
          icon: icons.payments,
          handler: onOpenPlan,
        }] }
        withRouter={ false }
        onAfterFormSubmit={ onCloseWindow }
        onCancel={ onCloseWindow }
      />
    </Window>
  )
}

export default SettingsDialog