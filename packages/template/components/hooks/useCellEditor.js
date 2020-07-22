import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import Actions from '../../utils/actions'
import layoutActions from '../../store/modules/layout'

import icons from '../../icons'

import useMoveMenu from './useMoveMenu'

import library from '../../library'

const EditIcon = icons.edit
const DeleteIcon = icons.delete
const MoveIcon = icons.move

/*

  return handlers for editing a cell

*/
const useCellEditor = ({
  content_id,
  layout_id,
  layout_data,
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
    layout_data,
    rowIndex,
    cellIndex,
  })

  const onDelete = () => actions.onLayoutDelete({
    content_id,
    layout_id,
    layout_data,
    rowIndex,
    cellIndex,
  })

  const getMoveMenuItems = useMoveMenu({
    content_id,
    layout_id,
    layout_data,
    simpleMovement,
    rowIndex,
    cellIndex,
  })

  const cell = layout_data[rowIndex][cellIndex]
  const widget = library.widgets[cell.type]

  const getMenuItems = useCallback(() => {
    const moveItems = getMoveMenuItems()
    let deletable = true
    if(typeof(widget.deletable) === 'boolean') deletable = widget.deletable
    return [
      {
        title: 'Edit',
        icon: EditIcon,
        handler: onEdit,
      },
      moveItems.length > 0 ? {
        title: 'Move',
        icon: MoveIcon,
        items: moveItems,
      } : null, 
      deletable ? {
        title: 'Delete',
        icon: DeleteIcon,
        handler: onDelete,
      } : null,
    ].filter(i => i)
  }, [
    getMoveMenuItems,
    cell,
    widget,
  ])

  

  return {
    onEdit,
    onDelete,
    getMoveMenuItems,
    getMenuItems,
    widget,
  }
}

export default useCellEditor