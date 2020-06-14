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
    marginRight: theme.spacing(2),
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
    settingsButton: true,
  })

  return (
    <div className={ classes.root }>
      <MenuButton
        header={ `${sectionTitle} : Settings` }
        getButton={ getSettingsButton }
        getItems={ getAllItems }
      />
    </div>
  )
}

export default NavbarSectionEditor