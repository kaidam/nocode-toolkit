import React from 'react'
import { useDispatch } from 'react-redux'
import classnames from 'classnames'
import IconButton from '@material-ui/core/IconButton'
import icons from '../../icons'
import eventUtils from '../../utils/events'

import Actions from '../../utils/actions'
import settingsActions from '../../store/modules/settings'

const EditIcon = icons.edit

const EditableSettings = ({
  classNames = {},
}) => {

  const actions = Actions(useDispatch(), {
    onOpenSettings: settingsActions.openDialog,
  })

  const iconClassname = classnames("navbar-ui-icon", classNames.icon)

  return (
    <IconButton
      size="small"
      className={ classNames.button }
      onClick={ (e) => {
        eventUtils.cancelEvent(e)
        actions.onOpenSettings() 
      }}
    >
      <EditIcon
        fontSize="inherit"
        className={ iconClassname }
      />
    </IconButton>
  )
}

export default EditableSettings