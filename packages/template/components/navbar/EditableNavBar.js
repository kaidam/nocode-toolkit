import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import MenuButton from '../widgets/MenuButton'

import useSectionEditor from '../hooks/useSectionEditor'
import useIconButton from '../hooks/useIconButton'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonMargin: {
    marginBottom: theme.spacing(1),
  },
  settingsIcon: ({contrast} = {}) => ({
    color: contrast ?
      theme.palette.primary.contrastText :
      theme.palette.text.main,
  }),
}))

const NavbarSectionEditor = ({
  section,
  contrast,
}) => {
  const classes = useStyles({
    contrast,
  })

  const {
    getSettingsItems,
    getAddItems,
  } = useSectionEditor({
    section,
    contrast,
  })

  const sectionTitle = (section || '')
    .replace(/^(\w)/, (st) => st.toUpperCase())

  const getSettingsButton = useIconButton({
    icon: 'edit',
    title: 'Edit',
  })

  const getAddButton = useIconButton({
    icon: 'add',
    title: 'Add Content',
    color: 'secondary',
  })

  return (
    <div className={ classes.root }>
      <div className={ classes.buttonMargin }>
        <MenuButton
          header={ sectionTitle }
          getButton={ getSettingsButton }
          getItems={ getSettingsItems }
        />
      </div>
      <div>
        <MenuButton
          header={ `${sectionTitle} : Add` }
          getButton={ getAddButton }
          getItems={ getAddItems }
        />
      </div>
    </div>
  )
}

export default NavbarSectionEditor