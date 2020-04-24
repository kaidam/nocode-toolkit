import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import useMenuButton from '../hooks/useMenuButton'
import Actions from '../../utils/actions'
import layoutActions from '../../store/modules/layout'

import icons from '../../icons'

const AddIcon = icons.add
const EditIcon = icons.edit
const DeleteIcon = icons.delete
const MoveIcon = icons.move
const RowIcon = icons.row
const CellIcon = icons.cell
const UpIcon = icons.up
const DownIcon = icons.down
const LeftIcon = icons.left
const RightIcon = icons.right

const IconCombo = (Left, Right) => () => (
  <div>
    <Left />
    <Right />
  </div>
)

const EditableBodyMenu = ({
  layout,
  content_id,
  layout_id,
  rowIndex,
  cellIndex,
  menuAnchor,
  getAddMenu,
  onClose,
  onReset,
}) => {

  const actions = Actions(useDispatch(), {
    onLayoutEdit: layoutActions.edit,
    onLayoutDelete: layoutActions.delete,
    onLayoutMove: layoutActions.move,
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

  const getAddMenuItems = useCallback(() => getAddMenu(rowIndex+1), [rowIndex])
  const getMoveMenuItems = useCallback(() => {

    const getOnMoveHandler = ({
      direction,
      merge,
    }) => () => actions.onLayoutMove({
      content_id,
      layout_id,
      rowIndex,
      cellIndex,
      direction,
      merge,
    })

    const row = layout[rowIndex]

    const up = (rowIndex > 0 || row.length > 1) ? {
      title: 'Up',
      icon: IconCombo(UpIcon, RowIcon),
      handler: rowIndex == 0 ? getOnMoveHandler({
        direction: 'up',
        merge: false,
      }) : null,
      items: rowIndex == 0 ? null : [{
        title: 'Up: Own Row',
        icon: IconCombo(UpIcon, RowIcon),
        handler: getOnMoveHandler({
          direction: 'up',
          merge: false,
        })
      }, {
        title: 'Up: Merge',
        icon: IconCombo(UpIcon, RowIcon),
        handler: getOnMoveHandler({
          direction: 'up',
          merge: true,
        })
      }]
    } : null

    const down = (rowIndex < layout.length - 1 || row.length > 1) ? {
      title: 'Down',
      icon: IconCombo(DownIcon, RowIcon),
      handler: rowIndex == layout.length - 1 ? getOnMoveHandler({
        direction: 'down',
        merge: false,
      }) : null,
      items: rowIndex == layout.length - 1 ? null : [{
        title: 'Down: Own Row',
        icon: IconCombo(DownIcon, RowIcon),
        handler: getOnMoveHandler({
          direction: 'down',
          merge: false,
        })
      }, {
        title: 'Down: Merge',
        icon: IconCombo(DownIcon, RowIcon),
        handler: getOnMoveHandler({
          direction: 'down',
          merge: true,
        })
      }]
    } : null

    const left = cellIndex > 0 ? {
      title: 'Left',
      icon: IconCombo(LeftIcon, CellIcon),
      handler: getOnMoveHandler({
        direction: 'left',
      })
    } : null

    const right = cellIndex < row.length - 1 ? {
      title: 'Right',
      icon: IconCombo(RightIcon, CellIcon),
      handler: getOnMoveHandler({
        direction: 'right',
      })
    } : null

    return [
      up,
      down,
      left,
      right,
    ].filter(i => i)
  }, [
    layout,
    content_id,
    layout_id,
    rowIndex,
    cellIndex,
  ])

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
      items: getAddMenuItems(),
    }, {
      title: 'Delete',
      icon: DeleteIcon,
      handler: onDelete,
    }].filter(i => i)
  }, [
    getAddMenuItems,
    getMoveMenuItems,
  ])

  const mainMenu = useMenuButton({
    parentAnchorEl: menuAnchor.el,
    anchorPosition: menuAnchor ? {
      left: menuAnchor.x,
      top: menuAnchor.y,
    } : null,
    getItems: getMenuItems,
    header: `Widget: ${menuAnchor.title}`,
    onClick: onReset,
    onClose,
  })

  return mainMenu.menus
}

export default EditableBodyMenu