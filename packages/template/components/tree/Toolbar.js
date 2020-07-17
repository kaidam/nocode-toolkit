import React, { useContext, useRef, useState, useCallback, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import OnboardingContext from '../contexts/onboarding'
import MenuButton from '../widgets/MenuButton'

import Toolbar from '../widgets/Toolbar'
import FocusElementOverlay from '../widgets/FocusElementOverlay'

import useSectionEditor from '../hooks/useSectionEditor'

import icons from '../../icons'
const SettingsIcon = icons.settings
const AddIcon = icons.add

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  buttons: {
    flexGrow: 0,
  },
  filler: {
    flexGrow: 1,
  },
  button: {
    marginTop: theme.spacing(0.5),
    textTransform: 'none',
    color: theme.palette.grey[600],
  },
}))

const TreeToolbar = ({
  section,
  type,
  focusRef,
  isNavDrawer,
}) => {
  const classes = useStyles()
  const settingsRef = useRef(null)
  const context = useContext(OnboardingContext)
  const [ isMenuOpen, setIsMenuOpen ] = useState(false)


  const onOpenMenu = useCallback(() => {
    setIsMenuOpen(true)
  })

  const onCloseMenu = useCallback(() => {
    setIsMenuOpen(false)
  })

  const {
    getAddItems,
    onOpenSettings,
  } = useSectionEditor({
    section,
    content_id: `section:${section}`,
    layout_id: 'widgets',
    withWidgets: true,
  })

  const getAddButton = useCallback((onClick) => {
    return (
      <Button
        ref={ settingsRef }
        className={ classes.button }
        size="small"
        onClick={ onClick }
      >
        <AddIcon className={ classes.icon } />&nbsp;&nbsp;Add
      </Button>
    )
  }, [
    classes
  ])

  useEffect(() => {
    context.setFocusElements({
      [`sectionSettings_${section}_${type}`]: {
        id: `sectionSettings_${section}_${type}`,
        ref: settingsRef,
        padding: 10,
      },
    })
  }, [])

  return (
    <Toolbar>
      <div className={ classes.container }>
        <div className={ classes.buttons }>
          <Button
            className={ classes.button }
            size="small"
            onClick={ onOpenSettings }
          >
            <SettingsIcon className={ classes.icon } />&nbsp;&nbsp;Settings
          </Button>
        </div>
        <div className={ classes.filler }></div>
        <div className={ classes.buttons }>
          <MenuButton
            getButton={ getAddButton }
            getItems={ getAddItems }
            onOpen={ onOpenMenu }
            onClose={ onCloseMenu }
          />
        </div>
      </div>
      {
        isMenuOpen && !isNavDrawer && (
          <FocusElementOverlay
            contentRef={ focusRef }
            padding={ 0 }
          />
        )
      }
    </Toolbar>
  )
}

export default TreeToolbar