import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import List from '@material-ui/core/List'
import TreeItem from './TreeItem'
import useSectionTree from '../hooks/useSectionTree'
import Actions from '../../utils/actions'
import contentActions from '../../store/modules/content'
import systemSelectors from '../../store/selectors/system'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}))

const Folder = ({
  parentId,
  nodes,
  depth,
  openFolders,
  itemProps,
}) => {
  const classes = useStyles()

  if(!nodes || nodes.length <= 0) return null
  return (
    <Droppable
      droppableId={ `tree-${parentId}` }
      type={ `tree-${parentId}` }
    >
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          <List className={ classes.root }>
            {
              nodes.map((node, i) => {
                const open = openFolders[node.id]
                return (
                  <Draggable
                    key={ `tree-${node.id}` }
                    draggableId={ `tree-${node.id}` }
                    index={ i }
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={ provided.innerRef }
                        { ...provided.draggableProps }
                        { ...provided.dragHandleProps }
                        style={ provided.draggableProps.style }
                      >
                        <TreeItem
                          node={ node }
                          depth={ depth }
                          open={ open }
                          { ...itemProps }
                        />
                        {
                          open && (
                            <Folder
                              parentId={ node.id }
                              nodes={ node.children }
                              depth={ depth+1 }
                              openFolders={ openFolders }
                              itemProps={ itemProps }
                            />
                          )
                        }
                      </div>
                    )}
                  </Draggable>
                )
              })
            }
            { provided.placeholder }
          </List> 
        </div>
      )}
    </Droppable>
  )
}

const DraggableTree = ({

  // the name of the section this tree is for
  section,

  // a ref for the container element for the tree
  // this is used so we can scroll to active elements
  containerRef,

  onClick,
}) => {

  const actions = Actions(useDispatch(), {
    onUpdateAnnotation: contentActions.updateAnnotation,
  })

  const {
    onToggleFolder,
    tree,
    childrenMap,
    openFolders,
    scrollToCurrentPage,
    onDisableScrollToCurrentPage,
  } = useSectionTree({
    section,
  })

  const showUI = useSelector(systemSelectors.showUI)

  const onDragEnd = result => {
    if (!result.destination) return
    const parentId = result.type.replace(/^tree-/, '')
    const ids = childrenMap[parentId]

    const startIndex = result.source.index
    const endIndex = result.destination.index

    const newIds = [].concat(ids)
    const [removed] = newIds.splice(startIndex, 1)
    newIds.splice(endIndex, 0, removed)

    actions.onUpdateAnnotation({
      id: parentId,
      data: {
        sorting: {
          type: 'manual',
          ids: newIds,
        },
      },
      snackbarMessage: 'sorting updated',
      reload: false,
    })
  }

  const itemProps = {
    showUI,
    containerRef,
    scrollToCurrentPage,
    onDisableScrollToCurrentPage,
    onToggleFolder,
    onClick,
  }

  return (
    <DragDropContext
      onDragEnd={ onDragEnd }
    >
      <Folder
        parentId={ `section:${section}` }
        nodes={ tree }
        depth={ 0 }
        openFolders={ openFolders }
        itemProps={ itemProps }
      />
    </DragDropContext>
  )
}

export default DraggableTree