import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch } from 'react-redux'

import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'

import Actions from '../../utils/actions'

import contentActions from '../../store/modules/content'

import typeUI from '../../types/ui'
import icons from '../../icons'

import MenuButton from './MenuButton'

const SettingsIcon = icons.settings
const MoreVertIcon = icons.moreVert

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

  const useItems = [settingsItem]
    
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