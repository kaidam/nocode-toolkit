import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { v4 as uuid } from 'uuid'

import Cell from '../layout/Cell'

import settingsSelectors from '../../store/selectors/settings'
import systemSelectors from '../../store/selectors/system'
import nocodeSelectors from '../../store/selectors/nocode'

const DEFAULT_LAYOUT = []

const useLayoutCellRenderer = ({
  content_id,
  layout_id,
  simpleMovement,
}) => {

  const annotations = useSelector(nocodeSelectors.annotations)
  const annotation = annotations[content_id] || {}
  const layout = annotation[layout_id] || DEFAULT_LAYOUT
  const widgetRenderers = useSelector(settingsSelectors.widgetRenderers)
  const showUI = useSelector(systemSelectors.showUI)

  const useLayout = useMemo(() => {
    return layout.map(row => {
      return row.map(cell => {
        if(cell.id) return cell
        return Object.assign({}, cell, {
          id: uuid(),
        })
      })
    })
  }, [
    layout,
  ])

  const getCell = ({
    cell,
    rowIndex,
    cellIndex,
  }) => {
    return (
      <Cell
        key={ cellIndex }
        cell={ cell }
        layout={ useLayout }
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
    layout: useLayout,
    getCell,
  }

}

export default useLayoutCellRenderer