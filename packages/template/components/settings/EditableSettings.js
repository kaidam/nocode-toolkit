import React from 'react'
import { useDispatch } from 'react-redux'
import classnames from 'classnames'
import IconButton from '@material-ui/core/IconButton'
import icons from '../../icons'
import eventUtils from '../../utils/events'

import FocusElement from '../widgets/FocusElement'
import Actions from '../../utils/actions'
import settingsActions from '../../store/modules/settings'

const EditIcon = icons.edit

const EditableSettings = ({
  title,
  form,
  children,
}) => {

  const actions = Actions(useDispatch(), {
    onOpenSettings: () => settingsActions.editSettingsSection({
      form,
      title,
    }),
  })

  return (
    <FocusElement
      onClick={ actions.onOpenSettings }
    >
      { children }
    </FocusElement>
  )
}

export default EditableSettings