const copyLayout = (layout) => JSON.parse(JSON.stringify(layout || []))

const insertRow = ({
  // the existing data we are modifying
  layout,
  params: {
    // rowIndex of -1 means append a new row
    rowIndex = -1,
    // the actual data we are inserting
    data,
  } = {},
}) => {
  const newLayout = copyLayout(layout)
  const insertIndex = rowIndex >= 0 ? rowIndex : newLayout.length
  newLayout.splice(insertIndex, 0, [data])
  return newLayout
}

const insertCell = ({
  layout,
  params: {
    // this must be defined as we are targeting an existing row
    rowIndex,
    // cellIndex of -1 means append a new cell
    cellIndex = -1,
    // the actual data we are inserting
    data,
  },
}) => {
  const newLayout = copyLayout(layout)
  const row = newLayout[rowIndex]
  if(!row) throw new Error(`no row found ${rowIndex}`)
  const insertIndex = cellIndex >= 0 ? cellIndex : row.length
  row.splice(insertIndex, 0, data)
  return newLayout
}

const updateCell = ({
  layout,
  params: {
    rowIndex,
    cellIndex,
    data,
  } = {},
}) => {
  const newLayout = copyLayout(layout)
  const row = newLayout[rowIndex]
  if(!row) throw new Error(`no row found ${rowIndex}`)
  const cell = row[cellIndex]
  if(!cell) throw new Error(`no cell found ${rowIndex}:${cellIndex}`)
  newLayout[rowIndex][cellIndex] = data
  return newLayout
}

const moveCell = ({
  layout,
  params: {
    rowIndex,
    cellIndex,
    direction,
    merge,
  },
}) => {
  const newLayout = copyLayout(layout)
  const row = newLayout[rowIndex]
  if(!row) throw new Error(`no row found ${rowIndex}`)
  const cell = row[cellIndex]
  if(!cell) throw new Error(`no cell found ${rowIndex}:${cellIndex}`)

  if(direction == 'up' && rowIndex <= 0) throw new Error(`the cell is already at the top`)
  if(direction == 'down' && rowIndex >= layout.length - 1) throw new Error(`the cell is already at the bottom`)
  if(direction == 'left' && cellIndex <= 0) throw new Error(`the cell is already at the left`)
  if(direction == 'right' && cellIndex >= row.length - 1) throw new Error(`the cell is already at the right`)

  if(direction == 'up' || direction == 'down') {

    const direction = direction == 'up' ? -1 : 1
    const targetRowIndex = rowIndex + direction

    // we need to pluck this cell onto it's own row
    if(row.length > 1) {
      // remove the cell from the existing row
      row.splice(cellIndex, 1)
    }
    // we just move the whole row
    else {
      // remove the row from the layout
      newLayout.splice(rowIndex, 1)
    }

    if(merge) {
      const targetRow = layout[targetRowIndex]
      targetRow.push(cell)
    }
    else {
      // insert a new row
      newLayout.splice(targetRowIndex, 0, [cell])
    }
  }
  else {
    const direction = direction == 'left' ? -1 : 1
    const targetCellIndex = cellIndex + direction

    // remove the cell from the row
    row.splice(cellIndex, 1)

    // insert it at the new location
    row.splice(targetCellIndex, 0, cell)
  }

  return newLayout
}

const deleteCell = ({
  layout,
  params: {
    rowIndex,
    cellIndex,
  } = {},
}) => {
  const newLayout = copyLayout(layout)
  const row = newLayout[rowIndex]
  if(!row) throw new Error(`no row found ${rowIndex}`)
  const cell = row[cellIndex]
  if(!cell) throw new Error(`no cell found ${rowIndex}:${cellIndex}`)
  // if we are deleting the last cell in a row then we are deleting the row
  if(row.length == 1) {
    newLayout.splice(rowIndex, 1)
  }
  else {
    newLayout[rowIndex].splice(cellIndex, 1)
  }
  return newLayout
}

const EDIT_ACTION_HANDLERS = {
  insertRow,
  insertCell,
  updateCell,
  moveCell,
  deleteCell,
}

const editLayout = ({
  layout,
  method,
  params = {},
}) => {
  const actionHandler = EDIT_ACTION_HANDLERS[method]
  if(!actionHandler) throw new Error(`no action handler found for ${method}`)
  return actionHandler({
    layout,
    params,
  })
}

const layoutUtils = {
  editLayout,
}

export default layoutUtils