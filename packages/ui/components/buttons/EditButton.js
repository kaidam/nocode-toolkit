import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch } from 'react-redux'
import Fab from '@material-ui/core/Fab'

import Actions from '../../utils/actions'
import contentActions from '../../store/modules/content'

import typeUI from '../../types/ui'
import icons from '../../icons'

const EditIcon = icons.moreVert

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

const EditButton = ({
  id,
  driver = 'local',
  type,
  location,
  structure = 'tree',
  tiny,
}) => {
  const actions = Actions(useDispatch(), {
    onOpenContentForm: contentActions.openDialogContentForm,
  })
  const classes = useStyles()
  const handler = typeUI.editContentHandler({
    item: {
      id,
      driver,
      type,
    },
    location,
    structure,
    onOpenContentForm: actions.onOpenContentForm,
  })
  return (
    <Fab
      size="small"
      className={ tiny ? classes.tinyRoot : null }
      onClick={ (e) => {
        e.preventDefault()
        e.stopPropagation()
        handler()
      }}
    >
      <EditIcon />
    </Fab>
  )
}

export default EditButton