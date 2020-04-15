import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import List from '@material-ui/core/List'
import TreeItem from './TreeItem'
import useSectionTree from '../hooks/useSectionTree'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}))

const Tree = ({

  // the name of the section this tree is for
  section,

  // the suspended component we use to render the item
  // options - this gives control to the template
  // as to what the tree item menu does
  ItemEditorComponent,
  // folder pages means we treat folders as routes
  // if this is false, then clicking
  // on a folder just toggles it
  // if this is true - clicking on the folder itself
  // will open the folder route
  folderPages = true,

  // a ref for the container element for the tree
  // this is used so we can scroll to active elements
  containerRef,

  // when an item is clicked - run this function
  onClick,
}) => {
  const {
    onToggleFolder,
    list,
    scrollToCurrentPage,
    onDisableScrollToCurrentPage,
  } = useSectionTree({
    section,
  })

  const classes = useStyles()

  return (
    <List className={ classes.root }>
      {
        list.map((item, i) => {
          return (
            <TreeItem
              key={ i }
              item={ item }
              folderPages={ folderPages }
              ItemEditorComponent={ ItemEditorComponent }
              containerRef={ containerRef }
              scrollToCurrentPage={ scrollToCurrentPage }
              onDisableScrollToCurrentPage={ onDisableScrollToCurrentPage }
              onToggleFolder={ onToggleFolder }
              onClick={ onClick }
            />
          )
        })
      }
    </List> 
  )
}

export default Tree