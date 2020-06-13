import React, { useContext, useRef, useCallback, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import OnboardingContext from '../contexts/onboarding'
import MenuButton from '../widgets/MenuButton'

import Toolbar from '../widgets/Toolbar'

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

const EditableToolbar = ({
  section,
}) => {
  const classes = useStyles()
  const settingsRef = useRef(null)
  const context = useContext(OnboardingContext)

  const {    
    getAddItems,
    getSettingsItems,
  } = useSectionEditor({
    section,
  })

  const sectionTitle = (section || '')
    .replace(/^(\w)/, (st) => st.toUpperCase())

  const getSettingsButton = useIconButton({
    icon: 'settings',
    title: `${sectionTitle} : Settings`,
  })

  // useEffect(() => {
  //   context.setFocusElements({
  //     [`highlightAddSectionContent_${section}`]: {
  //       id: `highlightAddSectionContent_${section}`,
  //       ref: addContentRef,
  //       padding: 10,
  //     },
  //   })
  // }, [])

  return (
    <Toolbar>
      <div className={ classes.container }>
        <div className={ classes.filler }></div>
        <div className={ classes.button }>
          <MenuButton
            header={ `${sectionTitle} : Settings` }
            getButton={ getSettingsButton }
            getItems={ getSettingsItems }
          />
        </div>
      </div>
    </Toolbar>
  )
}

export default EditableToolbar