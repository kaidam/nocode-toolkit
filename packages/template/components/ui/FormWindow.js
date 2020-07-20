import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import Window from '../dialog/Window'

import useTabbedForm from '../hooks/useTabbedForm'
import uiSelectors from '../../store/selectors/ui'
import uiActions from '../../store/modules/ui'

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  windowTitle: {
    padding: 0,
  },
  windowActions: {
    padding: 0,
  },
  tabs: {
    backgroundColor: '#fff',
    borderBottom: 'solid 1px #ccc',
  },
  form: {
    flexGrow: 1,
    overflow: 'auto',
    padding: theme.spacing(2),
    backgroundColor: '#f5f5f5',
  },
  paper: {
    padding: theme.spacing(2),
    backgroundColor: '#fff',
  },
  buttons: {
    width: '100%',
    borderTop: 'solid 1px #ccc',
    backgroundColor: '#fff',
  },
}))

const FormWindowDialog = ({

}) => {

  const classes = useStyles()
  const dispatch = useDispatch()
  const formWindow = useSelector(uiSelectors.formWindow)

  const tabs = formWindow ? formWindow.tabs : []
  const values = formWindow ? formWindow.values : {}
  const config = formWindow ? formWindow.config : {}

  const renderForm = useTabbedForm({
    form: {tabs},
    config,
    values,
    open: formWindow ? true : false,
    withRouter: false,
    cancelTitle: 'Close',
    onSubmit: (values) => dispatch(uiActions.acceptFormWindow(values)),
    onCancel: () => dispatch(uiActions.cancelFormWindow()),
  })

  if(!formWindow) return null

  

  return renderForm(({
    getTabs,
    getForm,
    getButtons,
    hasTabs,
    onCancel,
  }) => {

    const title = config.title || hasTabs ? (
      <div className={ classes.tabs }>
        {
          config.title && (
            <Typography variant="h6" gutterBottom>
              { config.title }
            </Typography>
          )
        }
        {
          hasTabs && getTabs()
        }
      </div>
    ) : null

    const buttons = (
      <div className={ classes.buttons }>
        { getButtons() }
      </div>
    )

    return (
      <Window
        open
        compact
        noActions
        theme={{
          header: classes.windowTitle,
          actions: classes.windowActions,
        }}
        title={ title }
        size={ config.size || "md" }
        fullHeight={ typeof(config.fullHeight) == 'boolean' ? config.fullHeight : true }
        actions={ buttons }
        onCancel={ onCancel }
      > 
        <div className={ classes.form }>
          <Paper className={ classes.paper }>
            { getForm() }
          </Paper>
        </div>
      </Window>
    )
  })
}

export default FormWindowDialog