import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Actions from '../../utils/actions'
import uiActions from '../../store/modules/ui'
import uiSelectors from '../../store/selectors/ui'

import Window from './Window'

const ConfirmWindow = ({

}) => {
  const confirmWindow = useSelector(uiSelectors.confirmWindow)
  const title = confirmWindow ? confirmWindow.title : ''
  const message = confirmWindow ? confirmWindow.message : ''
  
  const cancelTitle = confirmWindow && confirmWindow.cancelTitle ? confirmWindow.cancelTitle : 'Cancel'
  const confirmTitle = confirmWindow && confirmWindow.confirmTitle ? confirmWindow.confirmTitle : 'Confirm'
  const showCancel = confirmWindow && confirmWindow.hideCancel ? false : true
  const showConfirm = confirmWindow && confirmWindow.hideConfirm ? false : true

  const actions = Actions(useDispatch(), {
    onCancel: () => uiActions.cancelConfirmWindow(),
    onConfirm: () => uiActions.acceptConfirmWindow(),
  })

  return (
    <Window
      open={ confirmWindow ? true : false }
      size="sm"
      title={ title }
      withCancel={ showCancel }
      cancelTitle={ cancelTitle }
      submitTitle={ confirmTitle }
      onSubmit={ showConfirm ? actions.onConfirm : null }
      onCancel={ showCancel ? actions.onCancel : null }
    >
      <div 
        dangerouslySetInnerHTML={{__html: message }}
      >
      </div>
    </Window>
  )
}

export default ConfirmWindow