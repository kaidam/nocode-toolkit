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
  onSubmit,
  onCancel,
}) => {

  const classes = useStyles()

  const [ tab, setTab ] = useState(null)
  const form = useSelector(contentSelectors.form)

  let currentSchema = form.schema || []

  let header = null
  const footer = (
    <DialogButtons
      withSubmit
      onSubmit={ onSubmit }
      onCancel={ onCancel }
    />
  )

  if(form.tabs) {
    const currentTab = form.tabs.find(t => t.id == tab) || form.tabs[0]
    currentSchema = currentTab.schema
    header = (
      <Tabs
        tabs={ form.tabs }
        current={ tab }
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
        />
      </div>
    </PanelBody>
  )
}

export default ContentForm