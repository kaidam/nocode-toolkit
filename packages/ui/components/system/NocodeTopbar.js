import React, { useCallback } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'

import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'

import Actions from '../../utils/actions'
import selectors from '../../store/selectors'
import uiActions from '../../store/modules/ui'

import GlobalOptions from '../buttons/GlobalOptions'

const useStyles = makeStyles(theme => createStyles({
  appBar: {
    position: 'relative',
    zIndex: theme.zIndex.drawer + 1,
    height: [`${theme.layout.uiTopbarHeight}px`, '!important'],
    backgroundColor: '#fff',
    boxShadow: 'none',
    borderBottom: 'solid 3px rgba(0, 0, 0, 1)',
  },
  toolbar: {
    height: [`${theme.layout.uiTopbarHeight}px`, '!important'],
    minHeight: [`${theme.layout.uiTopbarHeight}px`, '!important'],
    maxHeight: [`${theme.layout.uiTopbarHeight}px`, '!important'],
  },
  appBarTitle: {
    flexGrow: 1,
  },
  logo: {
    height: `${theme.layout.uiLogoHeight}px`,
    padding: '3px',
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
    color: '#000',
  },
  options: {
    paddingRight: theme.spacing(1.5),
  },
  previewModeLabel: {
    color: theme.palette.text.primary,
  },
}))

const NocodeTopbar = ({

}) => {
  const classes = useStyles()

  const actions = Actions(useDispatch(), {
    onSetPreviewMode: uiActions.setPreviewMode,
  })

  const previewMode = useSelector(selectors.ui.previewMode)

  const handleChange = useCallback(event => {
    actions.onSetPreviewMode(event.target.checked)
  }, [actions.onSetPreviewMode])

  return (
    <AppBar 
      position="static" 
      className={ classes.appBar }
    >
      <Toolbar
        className={ classes.toolbar }
      >
        <div className={ classes.appBarTitle }>
          <a
            href="/"
          >
            <img src="images/favicon.png" className={ classes.logo } />
          </a>
        </div>
        <div className={ classes.options }>
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  checked={ previewMode }
                  onChange={ handleChange }
                  color="secondary"
                />
              }
              label="preview"
              classes={{
                label: classes.previewModeLabel,
              }}
            />
          </FormGroup>
        </div>
        <div className={ classes.options }>
          <GlobalOptions />
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default NocodeTopbar
