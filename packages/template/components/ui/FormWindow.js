import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import Paper from '@material-ui/core/Paper'

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
  tabs: {
    flexGrow: 0,
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
    borderTop: 'solid 1px #ccc',
    backgroundColor: '#fff',
    flexGrow: 0,
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
    withRouter: false,
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
    return (
      <Window
        open
        compact
        noScroll
        noActions
        size={ config.size || "md" }
        fullHeight={ typeof(config.fullHeight) == 'boolean' ? config.fullHeight : true }
        onCancel={ onCancel }
      >
        <div className={ classes.root }>
          {
            hasTabs && (
              <div className={ classes.tabs }>
                { getTabs() }
              </div>
            )
          }
          <div className={ classes.form }>
            <Paper className={ classes.paper }>
              { getForm() }
            </Paper>
          </div>
          <div className={ classes.buttons }>
            { getButtons() }
          </div>
        </div>
      </Window>
    )
  })
}

export default FormWindowDialog