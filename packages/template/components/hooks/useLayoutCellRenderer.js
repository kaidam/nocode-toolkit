import React from 'react'
import { useSelector } from 'react-redux'

import Cell from '../layout/Cell'
import systemSelectors from '../../store/selectors/system'
import nocodeSelectors from '../../store/selectors/nocode'

const DEFAULT_LAYOUT = []

const useLayoutCellRenderer = ({
  content_id,
  layout_id,
  data,
  simpleMovement,
  editable,
}) => {

  const annotations = useSelector(nocodeSelectors.annotations)
  const annotation = annotations[content_id] || {}
  const layout = data || annotation[layout_id] || DEFAULT_LAYOUT
  const showUI = useSelector(systemSelectors.showUI)

  const getCell = ({
    cell,
    rowIndex,
    cellIndex,
  }) => {
    return (
      <Cell
        key={ cell.id }
        cell={ cell }
        layout={ layout }
        showUI={ showUI }
        content_id={ content_id }
        layout_id={ layout_id }
        simpleMovement={ simpleMovement }
        rowIndex={ rowIndex }
        cellIndex={ cellIndex }
        editable={ editable }
      />
    )
  }

  return {
    layout,
    getCell,
  }

}

export default useLayoutCellRenderer