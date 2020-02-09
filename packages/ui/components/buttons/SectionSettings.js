import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch } from 'react-redux'

import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'

import Actions from '../../utils/actions'

import contentActions from '../../store/modules/content'
import finderActions from '../../store/modules/finder'

import typeUI from '../../types/ui'
import icons from '../../icons'

import MenuButton from './MenuButton'

const SettingsIcon = icons.settings
const MoreVertIcon = icons.moreVert
const OpenIcon = icons.open

const useStyles = makeStyles({
  tinyRoot: {
    width: '24px',
    height: '24px',
    minHeight: '24px',
    '& svg': {
      fontSize: '1rem',
    }
  }
})

const SectionSettings = ({
  id,
  tiny,
}) => {
  const actions = Actions(useDispatch(), {
    onOpenContentForm: contentActions.openDialogContentForm,
    onOpenFolder: finderActions.openSectionFolder,
  })

  const classes = useStyles()

  const settingsHandler = useCallback(typeUI.editContentHandler({
    item: {
      id,
      driver: 'local',
      type: 'section',
    },
    location: 'root',
    structure: 'tree',
    onOpenContentForm: actions.onOpenContentForm,
  }), [id, actions])

  const settingsItem = {
    title: 'Settings',
    icon: SettingsIcon,
    handler: settingsHandler,
  }

  const openItem = {
    title: 'Open in Google Drive',
    icon: OpenIcon,
    handler: () => actions.onOpenFolder({
      section: id,
    })
  }

  const useItems = [
    settingsItem,
    openItem,
  ]
    
  return (
    <MenuButton
      items={ useItems }
      tiny
      getButton={ onClick => (
        <Tooltip title="Edit Settings">
          <Fab
            size="small"
            className={ tiny ? classes.tinyRoot : null }
            onClick={ onClick }
          >
            <MoreVertIcon />
          </Fab>
        </Tooltip>
      )}
    />
  )
}

export default SectionSettings