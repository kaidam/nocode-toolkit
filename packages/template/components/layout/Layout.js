import React, { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import useLayoutCellRenderer from '../hooks/useLayoutCellRenderer'

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

  const {
    layout,
    getCell,
  } = useLayoutCellRenderer({
    content_id,
    layout_id,
    simpleMovement,
  })

  if(!layout || layout.length <= 0) return null

  return (
    <div className={ classes.root }>    
      {
        layout.map((row, i) => {
          return (
            <div
              className={ classes.row }
              key={ i }
            >
              {
                row.map((cell, j) => {
                  return getCell({
                    cell,
                    rowIndex: i,
                    cellIndex: j,
                  })
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