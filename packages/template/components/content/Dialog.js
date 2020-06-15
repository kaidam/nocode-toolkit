import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Actions from '../../utils/actions'
import contentActions from '../../store/modules/content'
import contentSelectors from '../../store/selectors/content'
import FormWrapper from '../form/Wrapper'
import Window from '../dialog/Window'

import useForm from '../hooks/useForm'
import Form from './Form'

const ContentDialog = ({

}) => {
  const formWindow = useSelector(contentSelectors.formWindow)

  const actions = Actions(useDispatch(), {
    onSubmit: contentActions.acceptFormWindow,
    onCancel: contentActions.cancelFormWindow,
  })

  const renderForm = useForm({
    onSubmit: actions.onSubmit,
    onCancel: actions.onCancel,
  })

  return renderForm(({
    getTabs,
    getForm,
    getFooter,
  }) => {
    return (
      <Window
        open
        fullHeight={ 
          typeof(formWindow.fullHeight) === 'boolean' ?
            formWindow.fullHeight :
            true
        }
        compact
        noScroll
        noActions
        title={ formWindow.title }
        size={ formWindow.size || "lg" }
        onCancel={ actions.onCancel }
      >
        { getTabs() }
        { getForm() }
        { getFooter() }
      </Window>
    )
  })
}

export default ContentDialog