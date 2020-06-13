import React, { useContext, useRef, useCallback, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

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

console.log('--------------------------------------------')
console.log('REMINDER: activate the tree -> editable toolbar quickstart again')

const EditableToolbar = ({
  section,
}) => {
  const classes = useStyles()
  const settingsRef = useRef(null)
  const context = useContext(OnboardingContext)

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
            getItems={ getAllItems }
          />
        </div>
      </div>
    </Toolbar>
  )
}

export default EditableToolbar