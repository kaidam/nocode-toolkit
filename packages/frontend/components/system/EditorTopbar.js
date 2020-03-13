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

import uiActions from '../../store/modules/ui'
//import jobActions from '../../store/modules/job'

import systemSelectors from '../../store/selectors/system'
import uiSelectors from '../../store/selectors/ui'

import icons from '../../icons'

import NocodeLogo from '../widgets/NocodeLogo'
import GlobalOptions from './GlobalOptions'
import UserAvatar from './UserAvatar'

const RefreshIcon = icons.refresh
const BuildIcon = icons.send

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
    paddingBottom: '6px',
    height: [`${theme.layout.uiTopbarHeight}px`, '!important'],
    minHeight: [`${theme.layout.uiTopbarHeight}px`, '!important'],
    maxHeight: [`${theme.layout.uiTopbarHeight}px`, '!important'],
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  optionsContainer: {
    paddingTop: '5px',
    flexGrow: 0,
  },
  filler: {
    flexGrow: 1,
  },
  urlContainer: {
    paddingTop: '2px',
    paddingLeft: '20px',
    paddingRight: theme.spacing(3),
    color: '#000',
    flexGrow: 0,
    fontSize: '0.8em',
  },
  buttonContainer: {
    flexGrow: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  userContainer: {
    flexGrow: 0,
    paddingLeft: theme.spacing(1),
  },
  previewModeLabel: {
    color: theme.palette.text.primary,
  },
  button: {
    marginLeft: theme.spacing(3),
  },
}))

const NocodeTopbar = ({

}) => {
  const classes = useStyles()

  const actions = Actions(useDispatch(), {
    onSetPreviewMode: () => {},//uiActions.setPreviewMode,
    onRebuild: () => {},//jobActions.rebuild,
    onPublish: () => {},//jobActions.publish,
  })

  const user = useSelector(systemSelectors.user)
  const previewMode = useSelector(uiSelectors.previewMode)
  //const publishStatus = useSelector(selectors.job.publishStatus)

  const handleChange = useCallback(event => {
    actions.onSetPreviewMode(event.target.checked)
  }, [actions.onSetPreviewMode])

  let siteUrl = null
  
  // if(publishStatus && publishStatus.production) {
  //   siteUrl = publishStatus.production.urls[publishStatus.production.urls.length-1]
  // }

  const getGlobalOptionsButton = useCallback((onClick) => {
    return (
      <NocodeLogo
        onClick={ onClick }
      >
        {
          user && (
            <Hidden smDown>
              <div className={ classes.userContainer }>
                <UserAvatar
                  user={ user }
                />
              </div>
            </Hidden>
          )
        }
      </NocodeLogo>
    )
  }, [
    user,
    classes.userContainer,
  ])

  return (
    <AppBar 
      position="static" 
      className={ classes.appBar }
    >
      <Toolbar
        className={ classes.toolbar }
      >
        <div className={ classes.container }>
          <div className={ classes.optionsContainer }>
            <GlobalOptions
              getButton={ getGlobalOptionsButton }
            />
          </div>
          <div className={ classes.filler }>
          
          </div>
          <Hidden smDown>
            {
              siteUrl && (
                <div className={ classes.urlContainer }>
                  <a href={ siteUrl } target="_blank">
                    { siteUrl }
                  </a>
                </div>
              )
            }
            <div className={ classes.buttonContainer }>
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
              <Button
                variant="contained"
                size="small"
                startIcon={<RefreshIcon />}
                onClick={ actions.onRebuild }
              >
                Reload
              </Button>
              <Button
                variant="contained"
                size="small"
                className={classes.button}
                startIcon={<BuildIcon />}
                onClick={ actions.onPublish }
              >
                Build Website
              </Button>
            </div>
          </Hidden>
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default NocodeTopbar
