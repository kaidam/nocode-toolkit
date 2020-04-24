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
  const widgetTitles = useSelector(settingsSelectors.widgetTitles)
  const showUI = useSelector(systemSelectors.showUI)

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
                      widgetTitles={ widgetTitles }
                      showUI={ showUI }
                      content_id={ content_id }
                      layout_id={ layout_id }
                      rowIndex={ i }
                      cellIndex={ j }
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