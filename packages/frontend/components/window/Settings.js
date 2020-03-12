import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Actions from '../../utils/actions'
import uiActions from '../../store/modules/ui'
import uiSelectors from '../../store/selectors/ui'

import Window from './Window'

const SettingsWindow = ({

}) => {

  const actions = Actions(useDispatch(), {
    onCancel: () => uiActions.cancelConfirmWindow(),
    onConfirm: () => uiActions.acceptConfirmWindow(),
  })

  return (
    <Window
      open
      size="lg"
      title="Settings"
    >
      This is the settings window
    </Window>
  )
}

export default SettingsWindow