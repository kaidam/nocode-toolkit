import React, { useCallback, useState, useRef, useContext, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Hidden from '@material-ui/core/Hidden'

import MenuButton from '../widgets/MenuButton'

import FocusElementOverlay from '../widgets/FocusElementOverlay'
import OnboardingContext from '../contexts/onboarding'
import useSectionEditor from '../hooks/useSectionEditor'
import useIconButton from '../hooks/useIconButton'

import icons from '../../icons'
const SettingsIcon = icons.settings
const AddIcon = icons.add

const useStyles = makeStyles(theme => ({
  bigroot: ({vertical, contrast}) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    textAlign: 'right',
    paddingRight: theme.spacing(2),
    marginRight: theme.spacing(2),
    borderRight: `1px dotted ${contrast ? theme.palette.primary.contrastText : theme.palette.grey[600]}`,
  }),
  button: ({contrast}) => ({
    //marginTop: theme.spacing(0.5),
    textTransform: 'none',
    color: contrast ?
      theme.palette.primary.contrastText :
      theme.palette.grey[600],
  }),
  smallSettingsButton: ({contrast}) => ({
    //marginTop: theme.spacing(0.5),
    minWidth: 0,
    textTransform: 'none',
    color: contrast ?
      theme.palette.primary.contrastText :
      theme.palette.primary.main,
  }),
  icon: {
    fontSize: '16px',
  },
}))

const NavbarSettings = ({
  section,
  small,
  vertical,
  contrast,
  focusRef,
}) => {
  const classes = useStyles({
    vertical,
    contrast,
  })
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
    getAllItems,
  } = useSectionEditor({
    section,
    content_id: `section:${section}`,
    layout_id: 'widgets',
  })
  
  const getAddButton = useCallback((onClick) => {
    return (
      <Button
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

  const getSettingsButton = useCallback((onClick) => {
    return (
      <Button
        className={ classes.smallSettingsButton }
        size="small"
        onClick={ onClick }
      >
        <SettingsIcon className={ classes.icon } />
      </Button>
    )
  }, [
    classes
  ])

  return (
    <>
      <Hidden smDown implementation="css">
        <div className={ classes.bigroot }>
          <Button
            className={ classes.button }
            size="small"
            onClick={ onOpenSettings }
          >
            <SettingsIcon className={ classes.icon } />&nbsp;&nbsp;Settings
          </Button>
          <MenuButton
            getButton={ getAddButton }
            getItems={ getAddItems }
            onOpen={ onOpenMenu }
            onClose={ onCloseMenu }
          />
        </div>
      </Hidden>
      <Hidden mdUp implementation="css">
        <MenuButton
          getButton={ getSettingsButton }
          getItems={ getAllItems }
          onOpen={ onOpenMenu }
          onClose={ onCloseMenu }
        />
      </Hidden>
      {
        isMenuOpen && (
          <FocusElementOverlay
            contentRef={ focusRef }
            padding={ 0 }
            adjustTopbar={ false }
          />
        )
      }
    </>
  )
}

export default NavbarSettings


/* <MenuButton
        getButton={ getSettingsButton }
        getItems={ getAllItems }
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
        onOpen={ onOpenMenu }
        onClose={ onCloseMenu }
      /> */