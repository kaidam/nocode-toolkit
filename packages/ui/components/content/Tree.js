import React, { lazy, useState, useEffect, useCallback, useMemo } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useSelector, shallowEqual } from 'react-redux'

import List from '@material-ui/core/List'
import Collapse from '@material-ui/core/Collapse'

import selectors from '../../store/selectors'

import itemTypes from '../../types/item'
import Suspense from '../system/Suspense'
import ContentListItem from './ContentListItem'

const SectionEditor = lazy(() => import(/* webpackChunkName: "ui" */ '../buttons/SectionEditor'))

const useStyles = makeStyles(theme => createStyles({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  menu: {
    overflowY: 'auto',
    overflowX: 'hidden',
    flexGrow: 1,
  },
  sectionEditor: {
    flexGrow: 0,
    borderTop: '1px solid #ccc',
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(3),
  },
  sublist: {
    paddingLeft: theme.spacing(1.5),
    '& > ul': {
      paddingTop: ['0px', '!important'],
      paddingBottom: ['0px', '!important'],
    }
  },
}))

const DEFAULT_ARRAY = []

const TreeItem = ({
  showUI,
  item,
  path,
  currentItemId,
  routeMap,
  pathToItem,
  onToggleFolder,
  onOpenFolder,
  onClick,
}) => {
  const classes = useStyles()

  const itemType = itemTypes(item)
  const hasChildren = itemType.hasChildren(item)
  const hasRoute = itemType.hasRoute(item)
  const isOpen = pathToItem.indexOf(item.id) >= 0
  const isCurrentPage = currentItemId == item.id
  const itemRoute = routeMap[item.id]

  const children = useMemo(() => {
    return hasChildren ? (
      <Collapse in={ isOpen } timeout="auto" unmountOnExit>
        <div className={ classes.sublist }>
          <TreeItems
            showUI={ showUI }
            items={ item.children }
            path={ path.concat([item.id]) }
            currentItemId={ currentItemId }
            routeMap={ routeMap }
            pathToItem={ pathToItem }
            onToggleFolder={ onToggleFolder }
            onOpenFolder={ onOpenFolder }
            onClick={ onClick }
          />
        </div>
      </Collapse>
    ) : null
  }, [
    hasChildren,
    isOpen,
    showUI,
    item,
    path,
    currentItemId,
    routeMap,
    pathToItem,
    onToggleFolder,
    onOpenFolder,
    onClick,
  ])

  const onClickHandler = useCallback(() => {
    if(hasChildren) {
      onToggleFolder(item, path)
    }
    else if(hasRoute) {
      onClick()
    }
  }, [hasChildren, hasRoute, item, onToggleFolder, onClick])

  // open the folder when the item options are clicked
  const onOpenMenuHandler = useCallback(() => {
    if(hasChildren) onOpenFolder(item, path)
  }, [item, hasChildren, onOpenFolder])

  return (
    <ContentListItem
      showUI={ showUI }
      item={ item }
      itemRoute={ itemRoute }
      isCurrentPage={ isCurrentPage }
      isOpen={ isOpen }
      onClick={ onClickHandler }
      onMenuOpen={ onOpenMenuHandler }
    >
      { children }
    </ContentListItem>
  )
}

const TreeItems = ({
  showUI,
  path,
  items = DEFAULT_ARRAY,
  currentItemId,
  routeMap,
  pathToItem,
  onToggleFolder,
  onOpenFolder,
  onClick,
}) => {
  const list = useMemo(() => {
    return (
      <List>
        {
          items.map((item, i) => {
            return (
              <TreeItem
                key={ i }
                showUI={ showUI }
                item={ item }
                path={ path }
                currentItemId={ currentItemId }
                routeMap={ routeMap }
                pathToItem={ pathToItem }
                onToggleFolder={ onToggleFolder }
                onOpenFolder={ onOpenFolder }
                onClick={ onClick }
              />
            )
          })
        }
      </List>
    )
  }, [
    showUI,
    items,
    path,
    currentItemId,
    routeMap,
    pathToItem,
    onToggleFolder,
    onOpenFolder,
    onClick
  ])

  return list
}

const Tree = ({
  section,
  onClick,
}) => {

  const classes = useStyles()
  const route = useSelector(selectors.router.route)
  const currentItemId = route.item
  const sectionTreeSelector = useMemo(selectors.content.sectionTree, [])
  const sectionTree = useSelector(state => sectionTreeSelector(state, section))
  const routeMap = useSelector(selectors.nocode.routeMap)
  const items = sectionTree ? sectionTree.children : DEFAULT_ARRAY
  const storePathToItem = useSelector(selectors.content.routeItemPath)
  const { showUI } = useSelector(selectors.nocode.config)
  const [ pathToItem, setPathToItem ] = useState(storePathToItem)

  const onToggleFolderHandler = useCallback((item, path) => {
    const newPath = pathToItem.indexOf(item.id) >= 0 ? 
      path :
      path.concat(item.id)
    setPathToItem(newPath)
  }, [pathToItem])

  const onOpenFolderHandler = useCallback((item, path) => {
    if(pathToItem.indexOf(item.id) >= 0) return
    setPathToItem(path)
  }, [pathToItem])

  useEffect(() => {
    setPathToItem(storePathToItem)
  }, [storePathToItem])

  const list = useMemo(() => {
    if(items.length <= 0) return null
    return (
      <TreeItems
        showUI={ showUI }
        path={ DEFAULT_ARRAY }
        items={ items }
        currentItemId={ currentItemId }
        routeMap={ routeMap }
        pathToItem={ pathToItem }
        onToggleFolder={ onToggleFolderHandler }
        onOpenFolder={ onOpenFolderHandler }
        onClick={ onClick }
      />
    )
  }, [
    showUI,
    items,
    currentItemId,
    routeMap,
    pathToItem,
    onToggleFolderHandler,
    onOpenFolderHandler,
    onClick
  ])

  const parentFilter = useCallback((parentFilter) => parentFilter.indexOf('section') >= 0)
  
  return (
    <div
      className={ classes.root }
    >
      <div className={ classes.menu }>
        { list }
      </div>
      <Suspense>
        <div className={ classes.sectionEditor }>
          <SectionEditor
            id={ section }
            tiny
            filter={ parentFilter }
            location={ `section:${section}` }
            structure="tree"
          />
        </div>
      </Suspense>
    </div>
  )
}

export default Tree