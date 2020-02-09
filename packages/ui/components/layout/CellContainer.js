import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import MenuButton from '../buttons/MenuButton'
import icons from '../../icons'

import CellOptions from './CellOptions'

const AddIcon = icons.add

const useStyles = makeStyles(theme => createStyles({
  root: {
    position: 'relative',
    width: '100%',
    height: '100%',
    cursor: 'pointer',
    border: '2px dotted rgba(255,255,255,0)',
    transition: 'background-color 200ms linear, border 200ms linear',
    '&:hover': {
      border: '2px dotted #999',
      backgroundColor: '#f5f5f5',
    },
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  nonSelectableRoot: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  editor: {
    padding: '8px',
    flexGrow: 0,
  },
  content: {
    flexGrow: 1,
  },
  activeRoot: {
    border: ['2px dotted #66a', '!important'],
    backgroundColor: ['#f5f5ff', '!important'],
  },
}))


const CellContainer = ({
  CellOptionsWrapper = CellOptions,
  isActive,
  location,
  data,
  cell,
  rowIndex,
  cellIndex,
  children,
  selectable,
  onSelect,
  onResetSelect
}) => {
  const classes = useStyles()
  const className = [
    selectable ? classes.root : classes.nonSelectableRoot,
    isActive ? classes.activeRoot : null
  ].filter(c => c).join(' ')
  return (
    <div
      className={ className }
    >
      <div className={ classes.editor }>
        {
          data.disableLayoutEditor ? null : (
            <CellOptionsWrapper
              isActive={ isActive }
              location={ location }
              data={ data }
              cell={ cell }
              rowIndex={ rowIndex }
              cellIndex={ cellIndex }
              onChange={ onResetSelect }
            />
          )
        }
      </div>
      <div
        className={ classes.content }
        onClick={ (e) => {
          e.preventDefault()
          e.stopPropagation()
          onSelect()
        }}
      >
        { children }
      </div>
    </div>
  )
}

export default CellContainer