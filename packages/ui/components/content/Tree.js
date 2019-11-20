import React, { lazy, useState, useEffect, useCallback, useMemo } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
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
  item,
  path,
  currentItemId,
  routeMap,
  rightClickEl,
  rightClickItem,
  pathToItem,
  onToggleFolder,
  onOpenFolder,
  onRightClick,
  onItemMenuClose,
  onClick,
}) => {
  const classes = useStyles()

  const itemType = itemTypes(item)
  const hasChildren = itemType.hasChildren(item)
  const hasRoute = itemType.hasRoute(item)
  const isOpen = pathToItem.indexOf(item.id) >= 0
  const isCurrentPage = currentItemId == item.id
  const itemRoute = routeMap[item.id]

  const parentAnchorEl = rightClickItem && rightClickItem.id == item.id ?
    rightClickEl : 
    null

  const children = useMemo(() => {
    return hasChildren ? (
      <Collapse in={ isOpen } timeout="auto" unmountOnExit>
        <div className={ classes.sublist }>
          <TreeItems
            items={ item.children }
            path={ path.concat([item.id]) }
            currentItemId={ currentItemId }
            routeMap={ routeMap }
            rightClickEl={ rightClickEl }
            rightClickItem={ rightClickItem }
            pathToItem={ pathToItem }
            onToggleFolder={ onToggleFolder }
            onOpenFolder={ onOpenFolder }
            onRightClick={ onRightClick }
            onItemMenuClose={ onItemMenuClose }
            onClick={ onClick }
          />
        </div>
      </Collapse>
    ) : null
  }, [
    hasChildren,
    isOpen,
    path,
    item,
  ])

  const onClickHandler = useCallback(() => {
    if(hasChildren) {
      onToggleFolder(path, item)
    }
    else if(hasRoute) {
      onClick()
    }
  }, [hasChildren, hasRoute, path, item])

  // open the folder when the item options are clicked
  const onOpenMenuHandler = useCallback(() => {
    if(hasChildren) onOpenFolder(path, item)
  }, [path, item, hasChildren])

  const onContextMenuHandler = useCallback((e) => {
    if(hasChildren) onOpenFolder(path, item)
    onRightClick(e, item)
  }, [path, item, hasChildren])

  return (
    <ContentListItem
      item={ item }
      itemRoute={ itemRoute }
      isCurrentPage={ isCurrentPage }
      isOpen={ isOpen }
      parentAnchorEl={ parentAnchorEl }
      onClick={ onClickHandler }
      onContextMenu={ onContextMenuHandler }
      onMenuOpen={ onOpenMenuHandler }
      onMenuClose={ onItemMenuClose }
    >
      { children }
    </ContentListItem>
  )
}

const TreeItems = ({
  path,
  items = DEFAULT_ARRAY,
  currentItemId,
  routeMap,
  rightClickEl,
  rightClickItem,
  pathToItem,
  onToggleFolder,
  onOpenFolder,
  onRightClick,
  onItemMenuClose,
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
                item={ item }
                path={ path }
                currentItemId={ currentItemId }
                routeMap={ routeMap }
                rightClickEl={ rightClickEl }
                rightClickItem={ rightClickItem }
                pathToItem={ pathToItem }
                onToggleFolder={ onToggleFolder }
                onOpenFolder={ onOpenFolder }
                onRightClick={ onRightClick }
                onItemMenuClose={ onItemMenuClose }
                onClick={ onClick }
              />
            )
          })
        }
      </List>
    )
  }, [items])

  return list
}

const Tree = ({
  section,
  onClick,
}) => {
  const classes = useStyles()
  const route = useSelector(selectors.router.route)
  const currentItemId = route.item
  const sectionTree = useSelector(state => selectors.content.sectionTree(state, section))
  const routeMap = useSelector(selectors.nocode.routeMap)
  const items = sectionTree ? sectionTree.children : DEFAULT_ARRAY
  const storePathToItem = useSelector(selectors.content.routeItemPath)
  const showUI = useSelector(state => selectors.nocode.config(state, 'showUI'))

  const [ rightClickEl, setRightClickEl ] = useState(null)
  const [ rightClickItem, setRightClickItem ] = useState(null)
  const [ pathToItem, setPathToItem ] = useState(storePathToItem)

  const onToggleFolderHandler = useCallback((path, item) => {
    const isOpen = (pathToItem || DEFAULT_ARRAY).indexOf(item.id) >= 0
    const newPath = isOpen ? 
      path :
      path.concat(item.id)
    setPathToItem(newPath)
  }, [pathToItem])

  const onOpenFolderHandler = useCallback((path, item) => {
    const isOpen = (pathToItem || DEFAULT_ARRAY).indexOf(item.id) >= 0
    if(isOpen) return
    setPathToItem(path.concat(item.id))
  }, [pathToItem])

  const onRightClickHandler = useCallback((e, item) => {
    if(!showUI) return true
    e.stopPropagation()
    e.preventDefault()
    setRightClickEl(e.target)
    setRightClickItem(item)
    return false
  }, [showUI])

  const onItemMenuCloseHandler = useCallback(() => {
    setRightClickEl(null)
    setRightClickItem(null)
  }, [])

  const onClickHandler = useCallback(() => {
    onClick && onClick()
  }, [onClick])

  useEffect(() => {
    setPathToItem(storePathToItem)
  }, [storePathToItem])

  const list = useMemo(() => {
    if(items.length <= 0) return null
    return (
      <TreeItems
        path={ DEFAULT_ARRAY }
        items={ items }
        currentItemId={ currentItemId }
        routeMap={ routeMap }
        rightClickEl={ rightClickEl }
        rightClickItem={ rightClickItem }
        pathToItem={ pathToItem }
        onToggleFolder={ onToggleFolderHandler }
        onOpenFolder={ onOpenFolderHandler }
        onRightClick={ onRightClickHandler }
        onItemMenuClose={ onItemMenuCloseHandler }
        onClick={ onClickHandler }
      />
    )
  }, [items])

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