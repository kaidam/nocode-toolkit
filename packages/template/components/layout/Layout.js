import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'

import useLayoutCellRenderer from '../hooks/useLayoutCellRenderer'

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
}))

const Layout = ({
  content_id,
  layout_id,
  data,
  simpleMovement,
  divider,
  editable = true,
}) => {

  const classes = useStyles()

  const {
    layout,
    getCell,
  } = useLayoutCellRenderer({
    content_id,
    layout_id,
    data,
    simpleMovement,
    editable,
  })

  if(!layout || layout.length <= 0) return null

  return (
    <>
      {
        layout.map((row, i) => {
          const cell = row[0]
          return (
            <div
              className={ classes.row }
              key={ cell.id }
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
    </>
  )
}

export default Layout