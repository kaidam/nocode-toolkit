import React, { useCallback } from 'react'
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
    <Droppable droppableId={ parentId } type={ parentId }>
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
                    key={ node.id }
                    draggableId={ node.id }
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

const Tree = ({

  // the name of the section this tree is for
  section,

  // a ref for the container element for the tree
  // this is used so we can scroll to active elements
  containerRef,
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

  const onDragEnd = useCallback(result => {
    if (!result.destination) return

    const parentId = result.type
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
  }, [
    childrenMap,
    tree,
  ])

  const itemProps = {
    showUI,
    containerRef,
    scrollToCurrentPage,
    onDisableScrollToCurrentPage,
    onToggleFolder,
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

export default Tree