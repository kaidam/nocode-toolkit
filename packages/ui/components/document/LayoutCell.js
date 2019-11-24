import React, { lazy } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import classnames from 'classnames'

import Suspense from '../system/Suspense'
import cellTypes from './cellTypes'



const useStyles = makeStyles(theme => createStyles({
  cell: {
    height: '100%',
    position: 'relative',
    minHeight: '45px',
  },
  cellUI: {
    border: '1px solid #f5f5f5',
  },
  content: {
    
  },
  contentPadding1: {
    padding: theme.spacing(1),
  },
  contentPadding2: {
    padding: theme.spacing(2),
  },
  contentPadding3: {
    padding: theme.spacing(3),
  },
  optionsButton: {
    position: 'absolute',
    top: '0px',
    right: '0px',
    padding: theme.spacing(1),
  },
}))

const LayoutCell = ({
  cell,
  data,
  showUI,
  rowIndex,
  cellIndex,
  disableEditor,
}) => {
  const classes = useStyles()

  const cellConfig = cellTypes.getCellConfig(cell.component)
  const RenderComponent = cellConfig.component

  const cellContent = cellTypes.getContent({
    cell,
    data,
  })

  const cellClassname = classnames({
    [classes.cell]: true,
    [classes.cellUI]: showUI,
  })

  const contentClassname = classnames({
    [classes.content]: true,
    [classes[`contentPadding${cellSettings.padding}`]]: cellSettings.padding ? true : false,
  })

  return (
    <div className={ cellClassname }>
      {
        !disableEditor && (
          <Suspense>
            <div className={ classes.optionsButton }>
              <CellOptions
                data={ data }
                cell={ cell }
                rowIndex={ rowIndex }
                cellIndex={ cellIndex }
              />
            </div>
          </Suspense>
        )
      }
      <div className={ contentClassname }>
        <RenderComponent
          showUI={ showUI }
          content={ cellContent }
        />
      </div>
    </div>
  )
}

export default LayoutCell