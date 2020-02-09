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
  smallOptionButton: {
    width: '24px',
    height: '24px',
    minHeight: '24px',
    '& svg': {
      fontSize: '1rem',
    }
  },
  topButtons: {
    position: 'absolute',
    width: '100%',
    top: '0px',
    left: '0px',
    textAlign: 'center',
  },
  bottomButtons: {
    position: 'absolute',
    width: '100%',
    bottom: '0px',
    left: '0px',
    textAlign: 'center',
  },
}))


const CellContainer = ({
  isActive,
  location,
  data,
  cell,
  rowIndex,
  cellIndex,
  onSelect,
  children,
  CellOptionsWrapper = CellOptions,
}) => {
  const classes = useStyles()
  const className = [
    classes.root,
    isActive ? classes.activeRoot : null
  ].filter(c => c).join(' ')
  return (
    <div
      className={ className }
      onClick={ onSelect }
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
            />
          )
        }
      </div>
      <div className={ classes.content }>
        { children }
      </div>
    </div>
  )
}

export default CellContainer