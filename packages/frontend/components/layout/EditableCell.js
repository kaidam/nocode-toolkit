import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Tooltip from '@material-ui/core/Tooltip'

import colorUtils from '../../utils/color'
import EditableCellMenu from './EditableCellMenu'

const useStyles = makeStyles(theme => {
  return {
    root: ({faded}) => ({
      position: 'relative',
      height: '100%',
      '& .content': {
        opacity: faded ? 0.5 : 1,
      },
    }),
    clicker: ({open}) => ({
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      cursor: 'pointer',
      backgroundColor: open ? colorUtils.getAlpha(theme.palette.primary.main, 0.2) : null,
      border: open ? `1px dotted ${theme.palette.primary.main}` : null,
      boxShadow: open ? `5px 5px 5px 0px rgba(0,0,0,0.3)` : null,
      '&:hover': {
        backgroundColor: colorUtils.getAlpha(theme.palette.primary.main, open ? 0.2 : 0.1),
      }
    }),
    tooltipContent: {
      width: '100%',
      height: '100%',
    },
  }
})

const EditableCell = ({
  id,
  layout,
  cell,
  content_id,
  layout_id,
  rowIndex,
  cellIndex,
  children,
  currentCellId,
  setCurrentCellId,
  getAddMenu,
}) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const classes = useStyles({
    faded: currentCellId && currentCellId != id,
    open,
  })

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    if(!anchorEl) {
      setAnchorEl(e.currentTarget)
      setCurrentCellId(id)
    }
    else {
      setAnchorEl(null)
      setCurrentCellId(null)
    }
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleReset = () => {
    setAnchorEl(null)
    setCurrentCellId(null)
  }

  useEffect(() => {
    if(currentCellId != id) handleClose()
  }, [
    id,
    currentCellId,
  ])

  const clicker = (
    <div
      className={ classes.clicker }
      onClick={ handleClick }
    >
      {
        open ? null : (
          <Tooltip title="click to edit..." placement="top" arrow>
            <div className={ classes.tooltipContent }></div>
          </Tooltip>
        )
      }
    </div>
  )

  return (
    
      <div className={ classes.root }>
        <div className="content">
          { children }
        </div>
        { clicker }
        {
          open && (
            <EditableCellMenu
              anchorEl={ anchorEl }
              layout={ layout }
              cell={ cell }
              content_id={ content_id }
              layout_id={ layout_id }
              rowIndex={ rowIndex }
              cellIndex={ cellIndex }
              getAddMenu={ getAddMenu }
              onClose={ handleClose }
              onReset={ handleReset }
            />
          )
        }
      </div>
    
    
  )
}

export default EditableCell