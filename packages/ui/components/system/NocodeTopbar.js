import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'

import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Button from '@material-ui/core/Button'
import Switch from '@material-ui/core/Switch'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Hidden from '@material-ui/core/Hidden'

import Actions from '../../utils/actions'
import selectors from '../../store/selectors'
import uiActions from '../../store/modules/ui'
import jobActions from '../../store/modules/job'

import icons from '../../icons'

import GlobalOptions from '../buttons/GlobalOptions'
import UserAvatar from './UserAvatar'

const RefreshIcon = icons.refresh

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative',
    zIndex: theme.zIndex.drawer + 1,
    height: [`${theme.layout.uiTopbarHeight}px`, '!important'],
    backgroundColor: '#f5f5f5',
    boxShadow: 'none',
    borderBottom: 'solid 2px rgba(0, 0, 0, 1)',
  },
  toolbar: {
    paddingLeft: '8px',
    paddingRight: '8px',
    height: [`${theme.layout.uiTopbarHeight}px`, '!important'],
    minHeight: [`${theme.layout.uiTopbarHeight}px`, '!important'],
    maxHeight: [`${theme.layout.uiTopbarHeight}px`, '!important'],
  },
  appBarTitle: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  logo: {
    height: `${theme.layout.uiLogoHeight}px`,
    // paddingTop: '3px',
    // paddingLeft: '3px',
    // paddingBottom: '3px',
    // paddingRight: '0px',
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
    color: '#000',
  },
  options: {
    paddingLeft: theme.spacing(1.5),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewModeLabel: {
    color: theme.palette.text.primary,
  },
  button: {
    marginRight: theme.spacing(3),
  },
}))

const NocodeTopbar = ({

}) => {
  const classes = useStyles()

  const actions = Actions(useDispatch(), {
    onSetPreviewMode: uiActions.setPreviewMode,
    onRebuild: jobActions.rebuild,
  })

  const user = useSelector(selectors.ui.user)
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
        <Hidden mdUp>
          <div className={ classes.appBarTitle }></div>
        </Hidden>
        <Hidden smDown>
          <div className={ classes.appBarTitle }>
            {
              user && (
                <UserAvatar
                  user={ user }
                />
              )
            }
          </div>
          <div className={ classes.options }>
            <Button
              variant="contained"
              size="small"
              className={classes.button}
              startIcon={<RefreshIcon />}
              onClick={ actions.onRebuild }
            >
              Reload
            </Button>
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
        </Hidden>
        <div className={ classes.options }>
          <GlobalOptions />
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default NocodeTopbar
