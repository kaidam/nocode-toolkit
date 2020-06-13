import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import Actions from '../../utils/actions'
import layoutActions from '../../store/modules/layout'

import icons from '../../icons'

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

const useMoveMenu = ({
  layout,
  content_id,
  layout_id,
  simpleMovement = false,
  rowIndex,
  cellIndex,
}) => {

  const actions = Actions(useDispatch(), {
    onLayoutMove: layoutActions.move,
  })

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

    let up = null

    if(simpleMovement) {
      up = (rowIndex > 0) ? {
        title: 'Up',
        icon: IconCombo(UpIcon, RowIcon),
        handler: getOnMoveHandler({
          direction: 'up',
          merge: false,
        }),
      } : null
    }
    else {
      up = (rowIndex > 0 || row.length > 1) ? {
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
    }

    let down = null

    if(simpleMovement) {
      down = (rowIndex < layout.length - 1) ? {
        title: 'Down',
        icon: IconCombo(DownIcon, RowIcon),
        handler: getOnMoveHandler({
          direction: 'down',
          merge: false,
        }),
      } : null
    }
    else {
      down = (rowIndex < layout.length - 1 || row.length > 1) ? {
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
    }

    const left = !simpleMovement && (cellIndex > 0) ? {
      title: 'Left',
      icon: IconCombo(LeftIcon, CellIcon),
      handler: getOnMoveHandler({
        direction: 'left',
      })
    } : null

    const right = !simpleMovement && (cellIndex < row.length - 1) ? {
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

  return getMoveMenuItems
}

export default useMoveMenu