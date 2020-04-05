import React, { lazy, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import settingsSelectors from '../../store/selectors/settings'
import systemSelectors from '../../store/selectors/system'
import nocodeSelectors from '../../store/selectors/nocode'
import Suspense from '../system/Suspense'

const EditableCell = lazy(() => import(/* webpackChunkName: "ui" */ './EditableCell'))

const useStyles = makeStyles(theme => ({
  root: {

  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  cell: {
    flexBasis: '100%',
    flex: 1,
  },
}))

const UnknownTypeRenderer = ({
  type,
}) => {
  return (
    <div>
      Error unknown cell type {type}
    </div>
  )
}

const Render = ({
  content_id,
  layout_id,
  getAddMenu,
  onDeleteCell,
}) => {

  const classes = useStyles()

  const annotations = useSelector(nocodeSelectors.annotations)
  const annotation = annotations[content_id] || {}
  const data = annotation[layout_id]
  const widgetRenderers = useSelector(settingsSelectors.widgetRenderers)
  const showUI = useSelector(systemSelectors.showUI)
  const [currentCellId, setCurrentCellId] = useState(null)

  useEffect(() => {
    const clickHandler = () => setCurrentCellId(null)
    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  }, [])

  if(!data || data.length <= 0) return null

  return (
    <div className={ classes.root }>
      {
        data.map((row, i) => {
          return (
            <div
              key={ i }
              className={ classes.row }
            >
              {
                row.map((cell, j) => {
                  const Renderer = widgetRenderers[cell.type] || UnknownTypeRenderer
                  const id = [i,j].join('.')

                  const content = (
                    <Renderer
                      data={ cell.data }
                      cell={{
                        id,
                        type: cell.type,
                        rowIndex: i,
                        cellIndex: j,
                      }}
                    />
                  )

                  const renderContent = showUI ? (
                    <Suspense>
                      <EditableCell
                        id={ id }
                        content_id={ content_id }
                        layout_id={ layout_id }
                        rowIndex={ i }
                        cellIndex={ j }
                        currentCellId={ currentCellId }
                        setCurrentCellId={ setCurrentCellId }
                        getAddMenu={ getAddMenu }
                        onDeleteCell={ onDeleteCell }
                      >
                        { content }
                      </EditableCell>
                    </Suspense>
                  ) : content
                  
                  return (
                    <div
                      key={ j }
                      className={ classes.cell }
                    >
                      { renderContent }
                    </div>
                  )
                })
              }
            </div>
          )
        })
      }
    </div>
  )
}

export default Render