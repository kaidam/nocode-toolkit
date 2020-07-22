import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { DragDropContext } from 'react-beautiful-dnd'

import Tabs from '../widgets/Tabs'
import Actions from '../../utils/actions'
import layoutActions from '../../store/modules/layout'
import layoutSelectors from '../../store/selectors/layout'
import contentSelectors from '../../store/selectors/content'
import websiteSelectors from '../../store/selectors/website'

import DraggableLayout from './DraggableLayout'
import DraggableWidgets from './DraggableWidgets'
import LayoutLibrary from './LayoutLibrary'
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
  sidebarHeader: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  sidebarContent: {
    flexGrow: 1,
    overflowY: 'auto',
  },
  sidebarTabs: {
    flexGrow: 0,
    borderBottom: `1px solid #ccc`,
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
  },
  saveButtonContainer: {
    marginTop: theme.spacing(2),
    textAlign: 'right',
  },
  widgetsContainer: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  pageCaption: {
    marginBottom: theme.spacing(2),
  }
}))

const TABS = [{
  id: 'widgets',
  title: 'Widgets',
},{
  id: 'layouts',
  title: 'Layouts',
}]

const EditLayoutDialog = ({
  
}) => {

  const classes = useStyles()
  const [ tab, setTab ] = useState(TABS[0].id)
  
  const {
    node,
    layout,
    layoutInfo,
  } = useSelector(contentSelectors.document)

  const actions = Actions(useDispatch(), {
    onLayoutSwapRow: layoutActions.swapRow,
    onClose: layoutActions.closeLayoutWindow,
    onChangeLayoutTemplate: layoutActions.changeDocumentLayoutTemplate,
    onSaveLayout: layoutActions.saveLayoutTemplate,
    onAddWidget: layoutActions.add,
  })

  const layoutWindow = useSelector(layoutSelectors.layoutWindow)
  const layouts = useSelector(websiteSelectors.websiteLayouts)

  const onUpdateLayoutId = id => {
    actions.onChangeLayoutTemplate({
      content_id: node.id,
      template_id: id,
    })
  }

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
    else if(result.destination.droppableId != result.source.droppableId && result.source.droppableId == `widgets`) {
      actions.onAddWidget({
        content_id: node.id,
        layout_id: 'layout',
        layout_data: layout,
        type: result.draggableId,
        rowIndex: result.destination.index,
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
              <div className={ classes.pageCaption }>
                <Typography variant="caption">
                  Click and drag widgets on the page to sort them...
                </Typography>
              </div>
              <Paper className={ classes.layout }>
                <DraggableLayout
                  content_id={ node.id }
                  layout_id="layout"
                  layout_data={ layout }
                  withContext={ false }
                />
              </Paper>
              <div className={ classes.saveButtonContainer }>
                <Button
                  variant="contained"
                  onClick={ actions.onSaveLayout }
                >
                  Export As Layout
                </Button>
              </div>
            </div>
          </div>
          <div className={ classes.sidebar }>
            <div className={ classes.sidebarTabs }>
              <Tabs
                tabs={ TABS }
                current={ tab }
                onChange={ id => setTab(id) }
              />
            </div>
            <div className={ classes.sidebarContent }>
              {
                tab == 'widgets' ? (
                  <div>
                    <div className={ classes.sidebarHeader }>
                      <Typography variant="caption">
                        Click and drag widgets onto the page to add them...
                      </Typography>
                    </div>
                    <div className={ classes.widgetsContainer }>
                      <DraggableWidgets />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className={ classes.sidebarHeader }>
                      <Typography variant="caption">
                        Choose from the library of preset layouts...
                      </Typography>
                    </div>
                    <LayoutLibrary
                      layouts={ layouts }
                      selected={ layoutInfo.selectedLayoutId }
                      onSelect={ onUpdateLayoutId }
                    />
                  </div>
                )
              }
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
