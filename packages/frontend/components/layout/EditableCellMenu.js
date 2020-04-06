import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import Popper from '@material-ui/core/Popper'
import Paper from '@material-ui/core/Paper'
import withMenuButton from '../hooks/withMenuButton'

import Actions from '../../utils/actions'
import layoutActions from '../../store/modules/layout'

import icons from '@nocode-toolkit/frontend/icons'

const AddIcon = icons.add
const EditIcon = icons.edit
const DeleteIcon = icons.delete
const MoveIcon = icons.move

const useStyles = makeStyles(theme => {
  return {
    button: {
      //color: theme.palette.grey[600],
      color: theme.palette.secondary.main,
      textTransform: 'lowercase',
      padding: theme.spacing(0.5),
    },
    buttonIcon: {
      fontSize: '1em',
    },
  }
})

const EditableCellMenu = ({
  layout,
  cell,
  content_id,
  layout_id,
  rowIndex,
  cellIndex,
  anchorEl,
  getAddMenu,
  onClose,
}) => {
  const classes = useStyles()

  const actions = Actions(useDispatch(), {
    onLayoutEdit: layoutActions.edit,
    onLayoutDelete: layoutActions.delete,
  })

  const getAddMenuItems = useCallback(() => getAddMenu(rowIndex+1), [rowIndex])

  const onEdit = () => actions.onLayoutEdit({
    content_id,
    layout_id,
    rowIndex,
    cellIndex,
  })

  const onDelete = () => actions.onLayoutDelete({
    content_id,
    layout_id,
    rowIndex,
    cellIndex,
  })

  const addMenu = withMenuButton({
    getItems: getAddMenuItems,
    onClose,
  })

  return (
    <Popper
      open
      id="options-popover"
      anchorEl={ anchorEl }
    >
      <Paper>
        <ButtonGroup size="small" aria-label="small outlined button group">
          <Button
            className={ classes.button }
            onClick={ addMenu.onClick }
          >
            <AddIcon className={ classes.buttonIcon } />&nbsp;add
          </Button>
          <Button
            className={ classes.button }
            onClick={ onEdit }
          >
            <EditIcon className={ classes.buttonIcon } />&nbsp;edit
          </Button>
          <Button
            className={ classes.button }
          >
            <MoveIcon className={ classes.buttonIcon } />&nbsp;move
          </Button>
          <Button
            className={ classes.button }
            onClick={ onDelete }
          >
            <DeleteIcon className={ classes.buttonIcon } />&nbsp;delete
          </Button>
        </ButtonGroup>
        {
          addMenu.menus
        }
      </Paper>
    </Popper>
  )
}

export default EditableCellMenu