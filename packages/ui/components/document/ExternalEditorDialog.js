import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import selectors from '../../store/selectors'

import Actions from '../../utils/actions'
import ExternalEditor from './ExternalEditor'

import documentActions from '../../store/modules/document'
import uiActions from '../../store/modules/ui'

const EditorExternalDialog = ({
  
}) => {
  const queryParams = useSelector(selectors.router.queryParams)
  const item = useSelector(state => selectors.nocode.item(state, 'content', queryParams.id))

  const actions = Actions(useDispatch(), {
    onSubmit: documentActions.saveExternalContent,
    onCancel: uiActions.closeDialogs,
  })

  const onSubmit = useCallback(() => {
    actions.onSubmit({
      driver: item.driver,
      id: item.id,
      onComplete: actions.onCancel,
    })
  })

  return (
    <ExternalEditor
      item={ item }
      loading={ false }
      onCancel={ actions.onCancel }
      onSubmit={ onSubmit }
    />
  )
}

export default EditorExternalDialog