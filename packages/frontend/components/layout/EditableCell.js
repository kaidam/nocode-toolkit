import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import EditableCellMenu from './EditableCellMenu'

const useStyles = makeStyles(theme => {
  return {
    root: ({open}) => ({
      position: 'relative',
      '& .content': {
        opacity: open ? 0.5 : 1,
      },
      '&:hover': {
        '& .content': {
          opacity: 0.5,
        }
      }
    }),
    clicker: ({open}) => ({
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      cursor: 'pointer',
      backgroundColor: theme.palette.primary.main,
      opacity: open ? 0.2 : 0,
    }),
    tooltipContent: {
      width: '100%',
      height: '100%',
    },
  }
})

const EditableCell = ({
  id,
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
              content_id={ content_id }
              layout_id={ layout_id }
              rowIndex={ rowIndex }
              cellIndex={ cellIndex }
              getAddMenu={ getAddMenu }
              onClose={ handleClose }
            />
          )
        }
      </div>
    
    
  )
}

export default EditableCell