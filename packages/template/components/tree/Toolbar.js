import React, { useContext, useRef, useState, useCallback, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import OnboardingContext from '../contexts/onboarding'
import MenuButton from '../widgets/MenuButton'

import Toolbar from '../widgets/Toolbar'
import FocusElementOverlay from '../widgets/FocusElementOverlay'

import useSectionEditor from '../hooks/useSectionEditor'
import useIconButton from '../hooks/useIconButton'

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  filler: {
    flexGrow: 1,
  },
  button: {
    flexGrow: 0,
    paddingRight: theme.spacing(1),
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
    getAllItems,
  } = useSectionEditor({
    section,
    content_id: `section:${section}`,
    layout_id: 'widgets',
    withWidgets: true,
  })

  const sectionTitle = (section || '')
    .replace(/^(\w)/, (st) => st.toUpperCase())

  const getSettingsButton = useIconButton({
    title: sectionTitle,
    useRef: settingsRef,
    settingsButton: true,
  })

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
        <div className={ classes.filler }></div>
        <div className={ classes.button }>
          <MenuButton
            getButton={ getSettingsButton }
            getItems={ getAllItems }
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