import React, { useCallback, useState, useRef, useContext, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'

import MenuButton from '../widgets/MenuButton'

import FocusElementOverlay from '../widgets/FocusElementOverlay'
import OnboardingContext from '../contexts/onboarding'
import useSectionEditor from '../hooks/useSectionEditor'
import useIconButton from '../hooks/useIconButton'

const useStyles = makeStyles(theme => ({
  sectionEditorRoot: ({vertical}) => ({
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  divider: ({contrast}) => ({
    marginLeft: theme.spacing(contrast ? 2 : 2),
    marginRight: theme.spacing(contrast ? 2 : 0),
    backgroundColor: contrast ? theme.palette.primary.contrastText : '',
  }),
  settingsIcon: ({contrast}) => ({
    color: contrast ?
      theme.palette.primary.contrastText :
      theme.palette.text.main,
  }),
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

  const settingsRef = useRef(null)

  const onCloseMenu = useCallback(() => {
    setIsMenuOpen(false)
  })

  const {    
    getAllItems,
  } = useSectionEditor({
    section,
    content_id: `section:${section}`,
    layout_id: 'widgets',
  })
  
  const sectionTitle = (section || '')
    .replace(/^(\w)/, (st) => st.toUpperCase())

  const getSettingsButton = useIconButton({
    title: sectionTitle,
    useRef: settingsRef,
    settingsButton: true,
  })

  useEffect(() => {
    if(!small) {
      context.setFocusElements({
        [`sectionSettings_${section}`]: {
          id: `sectionSettings_${section}`,
          ref: settingsRef,
          padding: 10,
        },
      })
    }
  }, [])

  return (
    <div className={ classes.sectionEditorRoot }>
      <MenuButton
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
      />
      <Divider
        orientation="vertical"
        className={ classes.divider }
      />
      {
        isMenuOpen && (
          <FocusElementOverlay
            contentRef={ focusRef }
            padding={ 0 }
            adjustTopbar={ false }
          />
        )
      }
    </div>
  )
}

export default NavbarSettings