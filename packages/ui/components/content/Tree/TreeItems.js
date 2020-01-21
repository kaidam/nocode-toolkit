import React, { lazy, useState, useCallback, useMemo } from 'react'

import Link from '@nocode-toolkit/website/Link'

import itemTypes from '../../../types/item'
import Suspense from '../../system/Suspense'
import defaultRenderers from './renderers'

const ItemOptions = lazy(() => import(/* webpackChunkName: "ui" */ '../../buttons/ItemOptions'))

const DEFAULT_ARRAY = []

export const TreeItem = ({
  renderers,
  showUI,
  item,
  path,
  currentItemId,
  routeMap,
  pathToItem,
  onToggleFolder,
  onOpenFolder,
  onClick,
  classes,
  ...props
}) => {
  const itemType = itemTypes(item)
  const hasChildren = itemType.hasChildren(item)
  const hasRoute = itemType.hasRoute(item)
  const isOpen = pathToItem.indexOf(item.id) >= 0 || currentItemId == item.id
  const isCurrentPage = currentItemId == item.id
  const itemRoute = routeMap[item.id]

  const ChildItemsRenderer = renderers.childItems || defaultRenderers.childItems
  const ItemOptionsRenderer = renderers.itemOptions || defaultRenderers.itemOptions
  const ItemRenderer = renderers.item || defaultRenderers.item

  const children = useMemo(() => {
    return hasChildren ? (
      <ChildItemsRenderer open={ isOpen }>
        <TreeItems
          classes={ classes }
          renderers={ renderers }
          showUI={ showUI }
          items={ item.children }
          path={ path.concat([item.id]) }
          currentItemId={ currentItemId }
          routeMap={ routeMap }
          pathToItem={ pathToItem }
          onToggleFolder={ onToggleFolder }
          onOpenFolder={ onOpenFolder }
          onClick={ onClick }
          {...props}
        />
      </ChildItemsRenderer>
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

  const [ rightClickEl, setRightClickEl ] = useState(null)

  const onMenuCloseHandler = useCallback(() => {
    setRightClickEl(null)
  }, [])

  // open the folder when the item options are clicked
  const onOpenMenuHandler = useCallback((e) => {
    e.stopPropagation()
    e.preventDefault()
    if(hasChildren) onOpenFolder(item, path)
  }, [item, hasChildren, onOpenFolder])

  const onClickHandler = useCallback(() => {
    if(hasChildren) {
      onToggleFolder(item, path)
    }
    else if(hasRoute && onClick) {
      onClick()
    }
  }, [hasChildren, hasRoute, item, onToggleFolder, onClick])

  const onRightClickHandler = useCallback((e) => {
    if(!showUI) return true
    e.stopPropagation()
    e.preventDefault()
    setRightClickEl(e.target)
    onOpenMenuHandler()
    return false
  }, [showUI, item, onOpenMenuHandler])

  const itemOptions = showUI && (
    <Suspense>
      <ItemOptionsRenderer
        {...props}
      >
        <ItemOptions
          item={ item }
          parentAnchorEl={ rightClickEl }
          onOpen={ onOpenMenuHandler }
          onClose={ onMenuCloseHandler }
        />
      </ItemOptionsRenderer>
    </Suspense>
  )
  
  let renderedItem = (
    <ItemRenderer
      item={ item }
      itemOptions={ itemOptions }
      isCurrentPage={ isCurrentPage }
      isOpen={ isOpen }
      hasChildren={ hasChildren }
      onClick={ onClickHandler }
      onRightClick={ onRightClickHandler }
      {...props}
    />
  )

  if(itemType.isLink(item)) {
    renderedItem = (
      <a
        href={ item.data.url }
        onContextMenu={ onRightClickHandler }
        target="_blank"
      >
        { renderedItem } 
      </a>
    )
  }
  else if(itemRoute) {
    renderedItem = (
      <Link
        path={ itemRoute.path }
        name={ itemRoute.name }
        onContextMenu={ onRightClickHandler }
      >
        { renderedItem }
      </Link>
    )
  }
  
  return (
    <React.Fragment>
      { renderedItem }
      { children }
    </React.Fragment>
  )
}

export const TreeItems = ({
  classes,
  renderers,
  showUI,
  path,
  items = DEFAULT_ARRAY,
  currentItemId,
  routeMap,
  pathToItem,
  onToggleFolder,
  onOpenFolder,
  onClick,
  ...props
}) => {
  const ListRenderer = renderers.list || defaultRenderers.list
  const list = useMemo(() => {
    return (
      <ListRenderer>
        {
          items.map((item, i) => {
            return (
              <TreeItem
                key={ i }
                classes={ classes }
                renderers={ renderers }
                showUI={ showUI }
                item={ item }
                path={ path }
                currentItemId={ currentItemId }
                routeMap={ routeMap }
                pathToItem={ pathToItem }
                onToggleFolder={ onToggleFolder }
                onOpenFolder={ onOpenFolder }
                onClick={ onClick }
                classes={ classes }
                {...props}
              />
            )
          })
        }
      </ListRenderer>
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
    onClick,
    classes
  ])

  return list
}

export default TreeItems