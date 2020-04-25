import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'

import contentSelectors from '../../store/selectors/content'

import FormRender from '../form/Render'
import Tabs from '../widgets/Tabs'
import DialogButtons from '../widgets/DialogButtons'
import PanelBody from '../widgets/PanelBody'

const useStyles = makeStyles(theme => ({
  formContainer: {
    padding: theme.spacing(2),
  },
}))

const ContentForm = ({
  isValid,
  values,
  errors,
  showErrors,
  touched,
  initialTab,
  onSubmit,
  onCancel,
  onSetFieldValue,
}) => {

  const classes = useStyles()

  const [ tab, setTab ] = useState(initialTab)
  const form = useSelector(contentSelectors.form)

  // this is so form handlers can be given a context
  // that they have selected from the store
  const handlerContext = useSelector(state => {
    return form.contextSelector ?
      form.contextSelector(state) :
      {}
  })

  let currentSchema = form.schema || []

  let header = null

  const footer = (
    <DialogButtons
      withSubmit
      submitDisabled={ isValid ? false : true }
      onSubmit={ onSubmit }
      onCancel={ onCancel }
    />
  )

  if(form.tabs) {
    const currentTab = form.tabs.find(t => t.id == tab) || form.tabs[0]
    currentSchema = currentTab.schema
    header = form.tabs.length > 1 && (
      <Tabs
        tabs={ form.tabs }
        current={ tab || currentTab.id }
        onChange={ setTab }
      />
    )
  }

  return (
    <PanelBody
      header={ header }
      footer={ footer }
    >
      <div className={ classes.formContainer }>
        <FormRender
          schema={ currentSchema }
          values={ values }
          errors={ errors }
          showErrors={ showErrors }
          touched={ touched }
          isValid={ isValid }
          onSetFieldValue={ onSetFieldValue }
          handlers={ form.handlers }
          handlerContext={ handlerContext }
        />
      </div>
    </PanelBody>
  )
}

export default ContentForm