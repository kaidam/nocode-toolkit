import React, { useMemo, useContext, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import Tooltip from '@material-ui/core/Tooltip'
import Fab from '@material-ui/core/Fab'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'

import Actions from '../../utils/actions'
import systemSelectors from '../../store/selectors/system'
import uiSelectors from '../../store/selectors/ui'
import uiActions from '../../store/modules/ui'
import useGlobalOptions from '../hooks/useGlobalOptions'

import GlobalSettingsItem from './GlobalSettingsItem'

import OnboardingContext from '../contexts/onboarding'

import icons from '../../icons'

const SettingsIcon = icons.settings
const CloseIcon = icons.close

const useStyles = makeStyles(theme => ({
  list: {
    width: '300px',
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  }
}))

const GlobalSettings = ({
  className,
}) => {
  const classes = useStyles()

  const settingsRef = useRef(null)
  const buildRef = useRef(null)

  const refs = {
    settings: settingsRef,
    build: buildRef,
  }

  const context = useContext(OnboardingContext)

  const actions = Actions(useDispatch(), {
    onSetPreviewMode: uiActions.setPreviewMode,
    onSetSettingsOpen: uiActions.setSettingsOpen,
  })

  const open = useSelector(uiSelectors.settingsOpen)

  const showUI = useSelector(systemSelectors.showUI)
  const onDisablePreview = () => actions.onSetPreviewMode(false)

  const getGlobalOptions = useGlobalOptions({
    includeExtra: true,
  })

  const globalOptions = useMemo(() => getGlobalOptions(), [
    getGlobalOptions,
  ])

  useEffect(() => {
    context.setFocusElements({
      publishWebsite: {
        id: 'publishWebsite',
        ref: buildRef,
      },
      editSettings: {
        id: 'editSettings',
        ref: settingsRef,
      }
    })
  }, [
    context.currentStep,
  ])

  return (
    <>
      <div className={ className }>
        <Tooltip title={ showUI ? "Settings" : "Disable Preview" }  placement="bottom" arrow>
          {
            showUI ? (
              <Fab
                size="medium"
                color="secondary"
                onClick={ () => actions.onSetSettingsOpen(true) }
              >
                <SettingsIcon />
              </Fab>
            ) : (
              <Fab
                size="medium"
                color="secondary"
                onClick={ onDisablePreview }
              >
                <CloseIcon />
              </Fab>
            )
          }
        </Tooltip>
      </div>
      <Drawer
        anchor="right"
        open={ open }
        onClose={ () => actions.onSetSettingsOpen(false) }
      >
        <List
          className={ classes.list }
          dense
        >
          {
            globalOptions.map((item, i) => {
              return (
                <GlobalSettingsItem
                  key={ i }
                  item={ item }
                  setOpen={ actions.onSetSettingsOpen }
                  useRef={ item.id ? refs[item.id] : null }
                />
              )
            })
          }
        </List>
      </Drawer>
    </>
  )
}

export default GlobalSettings
