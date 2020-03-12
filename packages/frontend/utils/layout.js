const insertRow = ({
  layout,
  rowIndex,
  params: {
    location,
  },
  cell,
}) => {
  const insertCell = cell || {
    component: 'blank',
  }
  const insertIndex = location == 'before' ?
    rowIndex :
    rowIndex + 1
  layout.splice(insertIndex, 0, [insertCell])
  return layout
}

const appendRow = ({
  layout,
  cell,
}) => {
  const insertCell = cell || {
    component: 'blank',
  }
  layout.push([insertCell])
  return layout
}

const insertCell = ({
  layout,
  rowIndex,
  cellIndex,
  params: {
    location,
  },
  cell,
}) => {
  const insertCell = cell || {
    component: 'blank',
  }
  const insertIndex = location == 'before' ?
    cellIndex :
    cellIndex + 1
  layout[rowIndex].splice(insertIndex, 0, insertCell)
  return layout
}

const moveCell = ({
  layout,
  rowIndex,
  cellIndex,
  params: {
    location,
    merge,
  },
  cell,
}) => {
  const row = layout[rowIndex]
  if(location == 'up' && rowIndex <= 0) throw new Error(`the cell is already at the top`)
  if(location == 'down' && rowIndex >= layout.length - 1) throw new Error(`the cell is already at the bottom`)
  if(location == 'left' && cellIndex <= 0) throw new Error(`the cell is already at the left`)
  if(location == 'right' && cellIndex >= row.length - 1) throw new Error(`the cell is already at the right`)

  if(location == 'up' || location == 'down') {

    const direction = location == 'up' ? -1 : 1
    const targetRowIndex = rowIndex + direction

    // we need to pluck this cell onto it's own row
    if(row.length > 1) {
      // remove the cell from the existing row
      row.splice(cellIndex, 1)
    }
    // we just move the whole row
    else {
      // remove the row from the layout
      layout.splice(rowIndex, 1)
    }

    if(merge) {
      const targetRow = layout[targetRowIndex]
      targetRow.push(cell)
    }
    else {
      // insert a new row
      layout.splice(targetRowIndex, 0, [cell])
    }
  }
  else {
    const direction = location == 'left' ? -1 : 1
    const targetCellIndex = cellIndex + direction

    // remove the cell from the row
    row.splice(cellIndex, 1)

    // insert it at the new location
    row.splice(targetCellIndex, 0, cell)
  }

  return layout
}

const deleteCell = ({
  layout,
  rowIndex,
  cellIndex,
}) => {
  const row = layout[rowIndex]
  // if we are deleting the last cell in a row then we are deleting the row
  if(row.length == 1) {
    layout.splice(rowIndex, 1)
  }
  else {
    layout[rowIndex].splice(cellIndex, 1)
  }
  return layout
}

const EDIT_ACTION_HANDLERS = {
  insertRow,
  appendRow,
  insertCell,
  moveCell,
  deleteCell,
}

const editLayout = ({
  layout,
  method,
  rowIndex,
  cellIndex,
  cell,
  params = {},
}) => {
  const actionHandler = EDIT_ACTION_HANDLERS[method]
  if(!actionHandler) throw new Error(`no action handler found for ${method}`)
  return actionHandler({
    layout: JSON.parse(JSON.stringify(layout)),
    rowIndex,
    cellIndex,
    params,
    cell,
  })
}

const layoutUtils = {
  editLayout,
}

export default layoutUtils