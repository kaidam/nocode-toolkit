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

const swapRow = ({
  layout,
  params: {
    sourceIndex,
    targetIndex,
  },
}) => {
  const newLayout = copyLayout(layout)
  const [removed] = newLayout.splice(sourceIndex, 1)
  newLayout.splice(targetIndex, 0, removed)
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
  if(direction == 'up' || direction == 'down') {
    let targetRowIndex = rowIndex + (direction == 'up' ? -1 : 1)
    // we need to pluck this cell onto it's own row
    if(row.length > 1) {
      // remove the cell from the existing row
      row.splice(cellIndex, 1)
    }
    // we just move the whole row
    else {
      // remove the row from the layout
      newLayout.splice(rowIndex, 1)
      targetRowIndex = (merge && direction == 'down') ? targetRowIndex - 1 : targetRowIndex
    }

    if(merge) {
      const targetRow = newLayout[targetRowIndex]
      if(!targetRow) throw new Error(`could not find row to merge at index ${targetRowIndex}`)
      targetRow.push(cell)
    }
    else {
      newLayout.splice(targetRowIndex, 0, [cell])
    }
  }
  else {
    const targetCellIndex = cellIndex + (direction == 'left' ? -1 : 1)

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

const convertLayoutToTemplate = ({
  layout,
}) => {
  return layout.map(row => {
    return row.map(cell => {
      return {
        type: cell.type,
      }
    })
  })
}

const layoutUtils = {
  insertRow,
  insertCell,
  updateCell,
  swapRow,
  moveCell,
  deleteCell,
  convertLayoutToTemplate,
}

export default layoutUtils