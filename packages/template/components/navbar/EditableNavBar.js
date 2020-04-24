import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import IconButton from '@material-ui/core/IconButton'
import MenuButton from '../widgets/MenuButton'

import icons from '../../icons'

import useSectionEditor from '../hooks/useSectionEditor'

const SettingsIcon = icons.settings

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
    ghostFolder,
    getSettingsItems,
  } = useSectionEditor({
    section,
    contrast,
  })

  const getSettingsButton = useCallback((onClick) => {
    return (
      <IconButton
        size="small"
        onClick={ onClick }
      >
        <SettingsIcon
          fontSize="inherit"
          className={ classes.settingsIcon }
        />
      </IconButton>
    )
  }, [
    classes,
  ])

  return (
    <div className={ classes.root }>
      <MenuButton
        header={ ghostFolder ? ghostFolder.name : '' }
        getButton={ getSettingsButton }
        getItems={ getSettingsItems }
      />
    </div>
  )
}

export default NavbarSectionEditor