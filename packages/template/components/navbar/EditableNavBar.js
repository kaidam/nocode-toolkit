import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import MenuButton from '../widgets/MenuButton'

import useSectionEditor from '../hooks/useSectionEditor'
import useIconButton from '../hooks/useIconButton'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
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

  return (
    <div className={ classes.root }>
      <MenuButton
        header={ sectionTitle }
        getButton={ getSettingsButton }
        getItems={ getSettingsItems }
      />
    </div>
  )
}

export default NavbarSectionEditor