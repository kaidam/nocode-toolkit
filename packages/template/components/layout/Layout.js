import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import settingsSelectors from '../../store/selectors/settings'
import systemSelectors from '../../store/selectors/system'
import nocodeSelectors from '../../store/selectors/nocode'

import Cell from './Cell'

const useStyles = makeStyles(theme => ({
  root: {

  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
}))

const Layout = ({
  content_id,
  layout_id,
  getAddMenu,
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
                  return (
                    <Cell
                      key={ j }
                      cell={ cell }
                      layout={ data }
                      widgetRenderers={ widgetRenderers }
                      showUI={ showUI }
                      content_id={ content_id }
                      layout_id={ layout_id }
                      rowIndex={ i }
                      cellIndex={ j }
                      currentCellId={ currentCellId }
                      setCurrentCellId={ setCurrentCellId }
                      getAddMenu={ getAddMenu }
                    />
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

export default Layout