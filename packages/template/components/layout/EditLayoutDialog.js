import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import { DragDropContext } from 'react-beautiful-dnd'

import Actions from '../../utils/actions'
import layoutActions from '../../store/modules/layout'
import layoutSelectors from '../../store/selectors/layout'
import contentSelectors from '../../store/selectors/content'

import DraggableLayout from './DraggableLayout'
import DraggableWidgets from './DraggableWidgets'
import Window from '../dialog/Window'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
  },
  contentContainer: {
    height: '100%',
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    overflowY: 'auto',
  },
  content: {
    margin: 'auto',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    width: '100%',
    maxWidth: '624px',
    minWidth: '400px',
  },
  sidebar: {
    flexGrow: 0,
    width: '360px',
    borderLeft: `1px solid #ccc`,
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarContent: {
    flexGrow: 1,
    overflowY: 'auto',
  },
  sidebarFooter: {
    flexGrow: 0,
    textAlign: 'right',
    padding: theme.spacing(1),
    borderTop: `1px solid #ccc`,
  },
  layout: {
    padding: theme.spacing(2),
    width: '100%',
  }
}))

const EditLayoutDialog = ({
  
}) => {

  const classes = useStyles()
  
  const {
    node,
    layout,
  } = useSelector(contentSelectors.document)

  const actions = Actions(useDispatch(), {
    onLayoutSwapRow: layoutActions.swapRow,
    onClose: layoutActions.closeLayoutWindow,
  })

  const layoutWindow = useSelector(layoutSelectors.layoutWindow)

  const onDragEnd = result => {
    if (!result.destination || !result.source) return

    // normal drag to re-order
    if(result.destination.droppableId == result.source.droppableId && result.destination.droppableId == `layout-${node.id}`) {
      const sourceIndex = result.source.index
      const targetIndex = result.destination.index
      actions.onLayoutSwapRow({
        content_id: node.id,
        layout_id: 'layout',
        layout_data: layout,
        sourceIndex,
        targetIndex,
        data: layout,
      })
    }
    
  }

  if(!layoutWindow) return null

  return (
    <Window
      open
      fullHeight
      compact
      noScroll
      noActions
      size="lg"
      onCancel={ actions.onClose }
    >
      <DragDropContext onDragEnd={ onDragEnd }>
        <div className={ classes.root }>
          <div className={ classes.contentContainer }>
            <div className={ classes.content }>
              <Paper className={ classes.layout }>
                <DraggableLayout
                  content_id={ node.id }
                  layout_id="layout"
                  layout_data={ layout }
                  withContext={ false }
                />
              </Paper>
            </div>
          </div>
          <div className={ classes.sidebar }>
            <div className={ classes.sidebarContent }>
              <DraggableWidgets />
            </div>
            <div className={ classes.sidebarFooter }>
              <Button
                variant="contained"
                onClick={ actions.onClose }
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DragDropContext>
    </Window>
  )
}

export default EditLayoutDialog
