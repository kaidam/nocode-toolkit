import React from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'

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
  simpleMovement,
  divider,
}) => {

  const classes = useStyles()

  const annotations = useSelector(nocodeSelectors.annotations)
  const annotation = annotations[content_id] || {}
  const data = annotation[layout_id]
  const widgetRenderers = useSelector(settingsSelectors.widgetRenderers)
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
                      showUI={ showUI }
                      content_id={ content_id }
                      layout_id={ layout_id }
                      simpleMovement={ simpleMovement }
                      rowIndex={ i }
                      cellIndex={ j }
                    />
                  )
                })
              }
            </div>
          )
        })
      }
      {
        divider && (
          <Divider />
        )
      }
    </div>
  )
}

export default Layout