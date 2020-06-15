import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'

import Typography from '@material-ui/core/Typography'

import Actions from '../../utils/actions'
import contentActions from '../../store/modules/content'
import contentSelectors from '../../store/selectors/content'
import Window from '../dialog/Window'

import useForm from '../hooks/useForm'

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flexGrow: 1,
  },
  tabs: {
    flexGrow: 0,
  },
}))

const ContentDialog = ({

}) => {

  const classes = useStyles()
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
    getButtons,
  }) => {
    return (
      <Window
        open
        size={ formWindow.size || "lg" }
        fullHeight={ 
          typeof(formWindow.fullHeight) === 'boolean' ?
            formWindow.fullHeight :
            true
        }
        compact={
          typeof(formWindow.compact) === 'boolean' ?
            formWindow.compact :
            false
        }
        title={(
          <div className={ classes.header }>
            <div className={ classes.title }>
              <Typography variant="h6">
                { formWindow.title }
              </Typography>
            </div>
            <div className={ classes.tabs }>
              { getTabs() }
            </div>
          </div>
        )}
        buttons={ getButtons() }
        onCancel={ actions.onCancel }
      >
        { getForm() }
      </Window>
    )
  })
}

export default ContentDialog