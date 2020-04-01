import React from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import settingsSelectors from '../../store/selectors/settings'

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
  border: {
    borderTop: '1px dotted #e5e5e5',
    borderLeft: '1px dotted #e5e5e5',
    borderRight: '1px dotted #e5e5e5',
    borderBottom: '1px dotted #e5e5e5',
  }
}))

const DefaultRenderer = ({
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
                  const Renderer = widgetRenderers[cell.type] || DefaultRenderer
                  return (
                    <div
                      key={ j }
                      className={ classes.cell }
                    >
                      <Renderer
                        type={ cell.type }
                        data={ cell.data }
                      />
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