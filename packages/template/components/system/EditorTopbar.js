import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Hidden from '@material-ui/core/Hidden'

import Actions from '../../utils/actions'

import uiActions from '../../store/modules/ui'
import jobActions from '../../store/modules/job'

import jobSelectors from '../../store/selectors/job'
import systemSelectors from '../../store/selectors/system'
import uiSelectors from '../../store/selectors/ui'

import NocodeLogo from '../widgets/NocodeLogo'
import GlobalOptions from './GlobalOptions'
import UserAvatar from './UserAvatar'
import EditorTopbarMenu from './EditorTopbarMenu'

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
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
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
    onSetPreviewMode: uiActions.setPreviewMode,
    onRebuild: () => jobActions.rebuild({withSnackbar:true}),
    onPublish: jobActions.publish,
  })

  const user = useSelector(systemSelectors.user)
  const previewMode = useSelector(uiSelectors.previewMode)
  const publishStatus = useSelector(jobSelectors.publishStatus)

  const handleChange = useCallback(event => {
    actions.onSetPreviewMode(event.target.checked)
  }, [actions.onSetPreviewMode])

  let siteUrl = null
  
  if(publishStatus && publishStatus.meta && publishStatus.meta.urls) {
    siteUrl = publishStatus.meta.urls[0]
  }

  const getGlobalOptionsButton = useCallback((onClick) => {
    return (
      <NocodeLogo
        onClick={ onClick }
      >
        {
          user && (
            <Hidden smDown implementation="css">
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
            <Hidden smDown implementation="css">
              {
                siteUrl && (
                  <div className={ classes.urlContainer }>
                    <a href={ siteUrl } target="_blank">
                      { siteUrl }
                    </a>
                  </div>
                )
              }
            </Hidden>
          </div>
          <div className={ classes.filler }>
          
          </div>
          <Hidden smDown implementation="css">
            <EditorTopbarMenu />
          </Hidden>
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default NocodeTopbar
