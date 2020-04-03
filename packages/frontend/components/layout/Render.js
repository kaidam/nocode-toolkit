import React, { lazy, useState } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import settingsSelectors from '../../store/selectors/settings'
import systemSelectors from '../../store/selectors/system'
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

const LayoutRender = ({
  data,
}) => {

  const classes = useStyles()
  const widgetRenderers = useSelector(settingsSelectors.widgetRenderers)
  const showUI = useSelector(systemSelectors.showUI)
  const [currentCellId, setCurrentCellId] = useState(null)

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
                        currentCellId={ currentCellId }
                        setCurrentCellId={ setCurrentCellId }
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

export default LayoutRender

/*

  <Suspense>
                        <div className={ editButtonClassname }>
                          <EditButton />
                        </div>
                      </Suspense>

*/