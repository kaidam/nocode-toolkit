import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Tooltip from '@material-ui/core/Tooltip'

import colorUtils from '../../utils/color'
import EditableCellMenu from './EditableCellMenu'

const useStyles = makeStyles(theme => {
  return {
    root: {
      position: 'relative',
      height: '100%',
      '& .content': {
        height: '100%',
      },
    },
    clicker: ({open}) => ({
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      cursor: 'pointer',
      backgroundColor: open ? colorUtils.getAlpha(theme.palette.primary.main, 0.2) : null,
      border: open ? `1px solid ${theme.palette.grey[400]}` : null,
      boxShadow: open ? `0px 5px 12px 0px rgba(0, 0, 0, 0.2)` : null,
      '&:hover': {
        backgroundColor: colorUtils.getAlpha(theme.palette.primary.main, 0.2),
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
  widgetTitles,
  rowIndex,
  cellIndex,
  children,
  getAddMenu,
}) => {
  const [menuAnchor, setMenuAnchor] = useState(null)
  const open = Boolean(menuAnchor)

  const classes = useStyles({
    open,
  })

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    if(!menuAnchor) {
      setMenuAnchor({
        title: widgetTitles[cell.type],
        el: e.currentTarget,
        x: e.nativeEvent.clientX + 5,
        y: e.nativeEvent.clientY + 5,
      })
    }
    else {
      setMenuAnchor(null)
    }
  }

  const handleReset = () => {
    setMenuAnchor(null)
  }

  const clicker = (
    <div
      className={ classes.clicker }
      onClick={ handleClick }
    >
      {
        open ? null : (
          <Tooltip title="Click to Edit" placement="top" arrow>
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
              menuAnchor={ menuAnchor }
              layout={ layout }
              cell={ cell }
              content_id={ content_id }
              layout_id={ layout_id }
              rowIndex={ rowIndex }
              cellIndex={ cellIndex }
              getAddMenu={ getAddMenu }
              onClose={ handleReset }
              onReset={ handleReset }
            />
          )
        }
      </div>
    
    
  )
}

export default EditableCell