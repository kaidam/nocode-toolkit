import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch } from 'react-redux'

import Fab from '@material-ui/core/Fab'

import Actions from '../../utils/actions'

import contentActions from '../../store/modules/content'
import finderActions from '../../store/modules/finder'

import typeUI from '../../types/ui'
import icons from '../../icons'

const SettingsIcon = icons.settings

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
    onOpenFinder: finderActions.openDialogFinder,
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

  return (
    <Fab
      size="small"
      className={ tiny ? classes.tinyRoot : null }
      onClick={ settingsHandler }
    >
      <SettingsIcon />
    </Fab>
  )
}

export default SectionSettings