import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'

import Actions from '../../utils/actions'
import contentActions from '../../store/modules/content'
import contentSelectors from '../../store/selectors/content'
import FormWrapper from '../form/Wrapper'
import Window from '../dialog/Window'

import Tabs from '../widgets/Tabs'
import FormRender from '../form/Render'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  tabs: {
    flexGrow: 0,
  },
  content: {
    flexGrow: 1,
  },
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
  onSetFieldValue,
  onSubmit,
  onCancel,
}) => {

  const classes = useStyles()

  const [ tab, setTab ] = useState(null)

  const formWindow = useSelector(contentSelectors.formWindow)
  const form = useSelector(contentSelectors.form)
  const formValues = useSelector(contentSelectors.formValues)
  const formSchema = useSelector(contentSelectors.formSchema)

  const renderForm = ({
    schema,
  }) => {
    return (
      <div className={ classes.formContainer }>
        <FormRender
          schema={ schema }
          values={ values }
          errors={ errors }
          showErrors={ showErrors }
          touched={ touched }
          isValid={ isValid }
        />
      </div>
    )
  }

  if(form.tabs) {
    const currentTab = form.tabs.find(t => t.id == tab) || form.tabs[0]

    return (
      <div className={ classes.container }>
        <div className={ classes.tabs }>

        </div>
        <div className={ classes.content }>

        </div>
      </div>
    )
  }
  else {
    return renderForm({
      schema: form.schema,
    })
  }
}

export default ContentForm