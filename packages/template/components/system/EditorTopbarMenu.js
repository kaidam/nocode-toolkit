import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'

import GlobalOptions from './GlobalOptions'

import Actions from '../../utils/actions'

import uiActions from '../../store/modules/ui'
import settingsActions from '../../store/modules/settings'
import jobActions from '../../store/modules/job'
import uiSelectors from '../../store/selectors/ui'

import icons from '../../icons'

const MenuIcon = icons.moreVert
const ReloadIcon = icons.refresh
const HideIcon = icons.hide
const ShowIcon = icons.look
const PublishIcon = icons.send
const SettingsIcon = icons.settings

const useStyles = makeStyles(theme => {
  return {
    root: {
      display: 'flex',
      flexDirection: 'row',
      borderRadius: '24px',
      padding: theme.spacing(0.75),
      backgroundColor: theme.palette.grey[200],
    },
    iconSection: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    iconContainer: {
      marginLeft: theme.spacing(0.25),
      marginRight: theme.spacing(0.25),
      padding: theme.spacing(0.2),
      borderRadius: '24px',
      backgroundColor: '#fff',
    },
    icon: {
      fontSize: '1.2em',
    },
  }
})

const EditorTopbarMenu = ({
  
}) => {
  const classes = useStyles()

  const previewMode = useSelector(uiSelectors.previewMode)
  const actions = Actions(useDispatch(), {
    onOpenSettings: settingsActions.openDialog,
    onRebuild: () => jobActions.rebuild({withSnackbar:true}),
    onPublish: jobActions.publish,
    onSetPreviewMode: uiActions.setPreviewMode,
  })

  const togglePreviewMode = useCallback(() => {
    actions.onSetPreviewMode(previewMode ? false : true)
  }, [
    previewMode,
  ])

  const getGlobalOptionsButton = useCallback((onClick) => {
    return (
      <div className={ classes.iconContainer }>
        <Tooltip title="Menu" placement="bottom">
          <IconButton
            size="small"
            onClick={ onClick }
          >
            <MenuIcon
              fontSize="inherit"
              className={ classes.icon }
            />
          </IconButton>
        </Tooltip>
      </div>
    )
  }, [
    classes.iconContainer,
    classes.icon,
  ])

  const PreviewIcon = previewMode ?
    HideIcon :
    ShowIcon

  return (
    <div className={ classes.root }>
      <div className={ classes.iconSection }>
        <GlobalOptions
          getButton={ getGlobalOptionsButton }
        />
        <div className={ classes.iconContainer }>
          <Tooltip title={ previewMode ? "Disable Proof Mode" : "Enable Proof Mode" } placement="bottom">
            <IconButton
              size="small"
              onClick={ togglePreviewMode }
            >
              <PreviewIcon
                fontSize="inherit"
                className={ classes.icon }
              />
            </IconButton>
          </Tooltip>
        </div>
        <div className={ classes.iconContainer }>
          <Tooltip title="Reload" placement="bottom">
            <IconButton
              size="small"
              onClick={ actions.onRebuild }
            >
              <ReloadIcon
                fontSize="inherit"
                className={ classes.icon }
              />
            </IconButton>
          </Tooltip>
        </div>
        <div className={ classes.iconContainer }>
          <Tooltip title="Settings" placement="bottom">
            <IconButton
              size="small"
              onClick={ actions.onOpenSettings }
            >
              <SettingsIcon
                fontSize="inherit"
                className={ classes.icon }
              />
            </IconButton>
          </Tooltip>
        </div>
        <div className={ classes.iconContainer }>
          <Tooltip title="Build" placement="bottom">
            <IconButton
              size="small"
              onClick={ actions.onPublish }
            >
              <PublishIcon
                fontSize="inherit"
                color="secondary"
                className={ classes.icon }
              />
            </IconButton>
          </Tooltip>
        </div>
        
        
      </div>
    </div>
  )
}

export default EditorTopbarMenu