import React from 'react'
import { useDispatch } from 'react-redux'

import FocusElement from '../widgets/FocusElement'
import Actions from '../../utils/actions'
import formActions from '../../store/modules/form'

const EditableSettings = ({
  title,
  group,
  children,
}) => {
  const actions = Actions(useDispatch(), {
    onOpenSettings: () => formActions.editSettingsGroup({
      title,
      group,
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