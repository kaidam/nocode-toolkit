import React, { lazy, useEffect, useRef, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import routerActions from '../../store/modules/router'
import nocodeSelectors from '../../store/selectors/nocode'
import routerSelectors from '../../store/selectors/router'
import systemSelectors from '../../store/selectors/system'

import Actions from '../../utils/actions'
import systemUtils from '../../utils/system'
import eventUtils from '../../utils/events'
import driveUtils from '../../utils/drive'

import Suspense from '../system/Suspense'

import { makeStyles } from '@material-ui/core/styles'

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

const EditableBody = ({
  children,
}) => {

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

export default EditableBody