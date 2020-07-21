import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
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
    maxWidth: '800px',
    minWidth: '400px',
  },
  sidebar: {
    flexGrow: 0,
    width: '300px',
    borderLeft: `1px solid #999`,
  },
  sidebarPaper: {
    height: '100%',
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
    onCancel: layoutActions.closeLayoutWindow,
  })

  const layoutWindow = useSelector(layoutSelectors.layoutWindow)

  const onDragEnd = result => {
    console.log('--------------------------------------------')
    console.log(result)
    // if (!result.destination) return
    // const sourceIndex = result.source.index
    // const targetIndex = result.destination.index
    // actions.onLayoutSwapRow({
    //   content_id,
    //   layout_id,
    //   sourceIndex,
    //   targetIndex,
    //   data,
    // })
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
    >
      <DragDropContext onDragEnd={ onDragEnd }>
        <div className={ classes.root }>
          <div className={ classes.contentContainer }>
            <div className={ classes.content }>
              <Paper className={ classes.layout }>
                <DraggableLayout
                  content_id={ node.id }
                  layout_id="layout"
                  data={ layout }
                  withContext={ false }
                />
              </Paper>
            </div>
          </div>
          <div className={ classes.sidebar }>
            <DraggableWidgets />
          </div>
        </div>
      </DragDropContext>
    </Window>
  )
}

export default EditLayoutDialog
