import React from 'react'
import classnames from 'classnames'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import List from '@material-ui/core/List'
import TreeItem from './TreeItem'
import useSectionTree from '../hooks/useSectionTree'

import systemSelectors from '../../store/selectors/system'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}))

const Folder = ({
  nodes,
  depth,
  openFolders,
  itemProps,
}) => {
  const classes = useStyles()
  if(!nodes || nodes.length <= 0) return null
  return (
    <List className={ classnames('nocode-tree-list', classes.root) }>
      {
        nodes.map((node, i) => {
          const open = openFolders[node.id]
          return (
            <React.Fragment key={ i }>
              <TreeItem
                node={ node }
                depth={ depth }
                open={ open }
                { ...itemProps }
              />
              {
                open && (
                  <Folder
                    nodes={ node.children }
                    depth={ depth+1 }
                    openFolders={ openFolders }
                    itemProps={ itemProps }
                  />
                )
              }
            </React.Fragment>
          )
        })
      }
    </List> 
  )
}

const Tree = ({

  // the name of the section this tree is for
  section,

  // when an item is opened
  onClick,

  // a ref for the container element for the tree
  // this is used so we can scroll to active elements
  containerRef,
}) => {
  const {
    onToggleFolder,
    tree,
    openFolders,
    scrollToCurrentPage,
    onDisableScrollToCurrentPage,
  } = useSectionTree({
    section,
  })

  const showUI = useSelector(systemSelectors.showUI)

  const itemProps = {
    showUI,
    containerRef,
    scrollToCurrentPage,
    onDisableScrollToCurrentPage,
    onToggleFolder,
    onClick,
  }

  return (
    <Folder
      nodes={ tree }
      depth={ 0 }
      openFolders={ openFolders }
      itemProps={ itemProps }
    />
  )
}

export default Tree