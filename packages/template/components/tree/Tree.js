import React from 'react'
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

const Tree = ({

  // the name of the section this tree is for
  section,

  // folder pages means we treat folders as routes
  // if this is false, then clicking
  // on a folder just toggles it
  // if this is true - clicking on the folder itself
  // will open the folder route
  folderPages = true,

  // a ref for the container element for the tree
  // this is used so we can scroll to active elements
  containerRef,
}) => {
  const {
    onToggleFolder,
    list,
    scrollToCurrentPage,
    onDisableScrollToCurrentPage,
  } = useSectionTree({
    section,
  })

  const showUI = useSelector(systemSelectors.showUI)

  const classes = useStyles()

  return (
    <List className={ classes.root }>
      {
        list.map((item, i) => {
          return (
            <TreeItem
              key={ i }
              showUI={ showUI }
              item={ item }
              folderPages={ folderPages }
              containerRef={ containerRef }
              scrollToCurrentPage={ scrollToCurrentPage }
              onDisableScrollToCurrentPage={ onDisableScrollToCurrentPage }
              onToggleFolder={ onToggleFolder }
            />
          )
        })
      }
    </List> 
  )
}

export default Tree