import React from 'react'
import { useSelector } from 'react-redux'

import Cell from '../layout/Cell'

import settingsSelectors from '../../store/selectors/settings'
import systemSelectors from '../../store/selectors/system'
import nocodeSelectors from '../../store/selectors/nocode'

const useLayoutCellRenderer = ({
  content_id,
  layout_id,
  simpleMovement,
}) => {

  const annotations = useSelector(nocodeSelectors.annotations)
  const annotation = annotations[content_id] || {}
  const layout = annotation[layout_id] || []
  const widgetRenderers = useSelector(settingsSelectors.widgetRenderers)
  const showUI = useSelector(systemSelectors.showUI)

  const getCell = ({
    cell,
    rowIndex,
    cellIndex,
  }) => {
    return (
      <Cell
        key={ cellIndex }
        cell={ cell }
        layout={ layout }
        widgetRenderers={ widgetRenderers }
        showUI={ showUI }
        content_id={ content_id }
        layout_id={ layout_id }
        simpleMovement={ simpleMovement }
        rowIndex={ rowIndex }
        cellIndex={ cellIndex }
      />
    )
  }

  return {
    layout,
    getCell,
  }

}

export default useLayoutCellRenderer