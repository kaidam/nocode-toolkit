import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import Actions from '../../utils/actions'
import layoutActions from '../../store/modules/layout'

import icons from '../../icons'

import useMoveMenu from './useMoveMenu'

const AddIcon = icons.add
const EditIcon = icons.edit
const DeleteIcon = icons.delete
const MoveIcon = icons.move

/*

  return handlers for editing a cell

*/
const useCellEditor = ({
  layout,
  content_id,
  layout_id,
  simpleMovement = false,
  rowIndex,
  cellIndex,
}) => {

  const actions = Actions(useDispatch(), {
    onLayoutEdit: layoutActions.edit,
    onLayoutDelete: layoutActions.delete,
    onLayoutMove: layoutActions.move,
    onLayoutAdd: layoutActions.addWidget,
  })

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

  const onAdd = () => actions.onLayoutAdd({
    content_id,
    layout_id,
    rowIndex: rowIndex+1,
  })

  const getMoveMenuItems = useMoveMenu({
    layout,
    content_id,
    layout_id,
    simpleMovement,
    rowIndex,
    cellIndex,
  })

  const getMenuItems = useCallback(() => {
    const moveItems = getMoveMenuItems()
    return [{
      title: 'Edit',
      icon: EditIcon,
      handler: onEdit,
    }, moveItems.length > 0 ? {
      title: 'Move',
      icon: MoveIcon,
      items: moveItems,
    } : null, {
      title: 'Add',
      icon: AddIcon,
      handler: onAdd,
    }, {
      title: 'Delete',
      icon: DeleteIcon,
      handler: onDelete,
    }].filter(i => i)
  }, [
    getMoveMenuItems,
  ])

  return {
    onEdit,
    onDelete,
    getMoveMenuItems,
    getMenuItems,
  }
}

export default useCellEditor