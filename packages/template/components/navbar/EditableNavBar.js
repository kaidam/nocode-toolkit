import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'

import MenuButton from '../widgets/MenuButton'

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

const NavbarSectionEditor = ({
  section,
  vertical,
  contrast,
}) => {
  const classes = useStyles({
    vertical,
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
    <div className={ classes.sectionEditorRoot }>
      <MenuButton
        header={ `${sectionTitle} : Settings` }
        getButton={ getSettingsButton }
        getItems={ getAllItems }
      />
      <Divider
        orientation="vertical"
        className={ classes.divider }
      />
    </div>
  )
}

export default NavbarSectionEditor