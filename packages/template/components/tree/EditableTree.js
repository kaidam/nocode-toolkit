import React, { useContext, useRef, useCallback, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import OnboardingContext from '../contexts/onboarding'
import MenuButton from '../widgets/MenuButton'

import useSectionEditor from '../hooks/useSectionEditor'
import useIconButton from '../hooks/useIconButton'

const useStyles = makeStyles(theme => ({
  root: {
    borderTop: '1px solid #cccccc',
    borderBottom: '1px solid #cccccc',
    paddingLeft: theme.spacing(1),
    backgroundColor: theme.palette.grey[100],
  },
  list: {
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0),
  },
  menuItem: {
    paddingLeft: theme.spacing(0), 
    paddingRight: theme.spacing(1),
    cursor: 'pointer',
    color: theme.palette.grey[600],
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    flexGrow: 1,
    marginTop: '2px',
    marginLeft: theme.spacing(1),
    color: theme.palette.text.main,
  },
  itemTextTypography: {
    fontWeight: 'bold',
  },
}))

const EditableTree = ({
  section,
}) => {
  const classes = useStyles()
  const addContentRef = useRef(null)
  const context = useContext(OnboardingContext)

  const {    
    getAddItems,
    getSettingsItems,
  } = useSectionEditor({
    section,
  })

  const sectionTitle = (section || '')
    .replace(/^(\w)/, (st) => st.toUpperCase())

  const getTitleSettingsButton = useCallback((onClick) => {
    return (
      <ListItemText
        classes={{
          primary: classes.itemTextTypography,
        }}
        primary={ sectionTitle }
        onClick={ onClick }
      />
    )
  }, [
    classes,
    sectionTitle,
  ])

  const getSettingsButton = useIconButton({
    icon: 'edit',
    title: `${sectionTitle} : Settings`,
  })

  const getAddButton = useIconButton({
    icon: 'add',
    title: `${sectionTitle} : Add`,
    color: 'secondary',
  })

  useEffect(() => {
    context.setFocusElements({
      [`highlightAddSectionContent_${section}`]: {
        id: `highlightAddSectionContent_${section}`,
        ref: addContentRef,
        padding: 10,
      },
    })
  }, [])

  return (
    <div className={ classes.root }>
      <List className={ classes.list }>
        <ListItem
          dense
          className={ classes.menuItem }
        >
          <MenuButton
            header={ `${sectionTitle} : Settings` }
            getButton={ getSettingsButton }
            getItems={ getSettingsItems }
          />
          <MenuButton
            className={ classes.itemText }
            header={ `${sectionTitle} : Settings` }
            getButton={ getTitleSettingsButton }
            getItems={ getSettingsItems }
          />
          <MenuButton
            header={ `${sectionTitle} : Add` }
            getButton={ getAddButton }
            getItems={ getAddItems }
            useRef={ addContentRef }
          />
        </ListItem>
      </List>
    </div>
  )
}

export default EditableTree