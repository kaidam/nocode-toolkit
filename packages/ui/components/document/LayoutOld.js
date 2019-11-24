import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import selectors from '../../store/selectors'
import LayoutCell from './LayoutCell'

const CellOptions = lazy(() => import(/* webpackChunkName: "ui" */ './CellOptions'))

const RenderRoot = ({
  children,
}) => {
  return children
}

const RenderCell = ({
  showUI,
  editor,
  cellConfig,
  content,
}) => {
  return (
    <div
      style={{
        height: '100%',
        position: 'relative',
        minHeight: '45px',
        border: showUI ? '1px solid #f5f5f5' : '',
      }}
    >
      {
        editor && (
          <div
            style={{
              position: 'absolute',
              top: '0px',
              right: '0px',
              padding: '8px',
            }}
          >
            { editor }
          </div>
        )
      }
      <div
        style={{
          padding: `${(cellConfig.padding || 0) * 8}px`,
        }}
      >
        { content }
      </div>
    </div>
  )
}
const defaultRenderers = {
  root: RenderRoot,
  cell: RenderCell,
}

const useStyles = makeStyles({
  paper: {
    minHeight: '200px',
  },
  row: {
    
  },
})

const DocumentLayout = ({

}) => {
  const classes = useStyles()
  const showUI = useSelector(selectors.ui.showUI)
  const data = useSelector(selectors.document.data)

  return (
    <Paper className={ classes.paper }>
      {
        data.layout.map((row, i) => {
          const gridSize = Math.floor(12 / row.length)
          return (
            <div key={ i } className={ classes.row }>
              <Grid
                container
                direction="row"
                justify="space-evenly"
                alignItems="stretch"
              >
                {
                  row.map((cell, j) => {
                    return (
                      <Grid
                        key={ j }
                        item
                        xs={ 12 }
                        sm={ gridSize }
                      >
                        <LayoutCell
                          rowIndex={ i }
                          cellIndex={ j }
                          data={ data }
                          cell={ cell }
                          showUI={ showUI }
                          disableEditor={ data.disableLayoutEditor }
                        />
                      </Grid>
                    )
                  })
                }
              </Grid>
            </div>
          )
        })
      }
    </Paper>
  )
}

export default DocumentLayout
