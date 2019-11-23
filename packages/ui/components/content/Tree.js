import React, { lazy, useState, useEffect, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'

import Link from '@nocode-toolkit/website/Link'
import selectors from '../../store/selectors'

import itemTypes from '../../types/item'
import Suspense from '../system/Suspense'

const SectionEditor = lazy(() => import(/* webpackChunkName: "ui" */ '../buttons/SectionEditor'))
const ItemOptions = lazy(() => import(/* webpackChunkName: "ui" */ '../buttons/ItemOptions'))

const DEFAULT_ARRAY = []

const RenderRoot = ({
  content,
  editor,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          flexFGrow: 1,
        }}
      >
        { content }
      </div>
      {
        editor && (
          <div
            style={{
              flexFGrow: 0,
            }}
          >
            { editor }
          </div>
        )
      }
    </div>
  )
}

const RendererList = ({
  children,
}) => {
  return (
    <div>
      { children }
    </div>
  )
}

const RendererChildItems = ({
  open,
  children,
}) => {
  return open ? (
    <div
      style={{
        paddingLeft: '20px',
      }}
    >
      { children }
    </div>
  ) : null
}

const RendererItemOptions = ({
  children,
}) => {
  return children
}

const RendererItem = ({
  item,
  itemOptions,
  isCurrentPage,
  isOpen,
  hasChildren,
  onClick,
  onRightClick,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        cursor: 'pointer',
      }}
      onClick={ onClick }
    >
      {
        itemOptions && (
          <div
            style={{
              flexGrow: 0,
              marginRight: '20px',
            }}
          >
            { itemOptions }
          </div>
        )
      }
      <div
        style={{
          flexGrow: 1,
        }}
      >
        { item.data.name}
      </div>
    </div>
  )
}

const defaultRenderers = {
  root: RenderRoot,
  list: RendererList,
  childItems: RendererChildItems,
  itemOptions: RendererItemOptions,
  item: RendererItem,
}

const TreeItem = ({
  classes,
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
}) => {
  const itemType = itemTypes(item)
  const hasChildren = itemType.hasChildren(item)
  const hasRoute = itemType.hasRoute(item)
  const isOpen = pathToItem.indexOf(item.id) >= 0
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
  const onOpenMenuHandler = useCallback(() => {
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

  const itemOptions = (
    <Suspense>
      <ItemOptionsRenderer>
        <ItemOptions
          item={ item }
          parentAnchorEl={ rightClickEl }
          onOpen={ onOpenMenuHandler }
          onClose={ onMenuCloseHandler }
        />
      </ItemOptionsRenderer>
    </Suspense>
  )

  const renderedItem = (
    <React.Fragment>
      <ItemRenderer
        item={ item }
        itemOptions={ itemOptions }
        isCurrentPage={ isCurrentPage }
        isOpen={ isOpen }
        hasChildren={ hasChildren }
        onClick={ onClickHandler }
        onRightClick={ onRightClickHandler }
      />
      { children }
    </React.Fragment>
  )

  if(itemType.isLink(item)) {
    return (
      <a
        href={ item.data.url }
        onContextMenu={ onRightClickHandler }
        target="_blank"
      >
        { renderedItem } 
      </a>
    )
  }
  else if(itemType.hasRoute(item) && itemRoute) {
    return (
      <Link
        name={ itemRoute.name }
        onContextMenu={ onRightClickHandler }
      >
        { renderedItem }
      </Link>
    )
  }
  else {
    return renderedItem
  }
}

const TreeItems = ({
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
    onClick
  ])

  return list
}

const Tree = ({
  classes = {},
  renderers = {},
  section,
  onClick,
}) => {

  const route = useSelector(selectors.router.route)
  const currentItemId = route.item
  const sectionTreeSelector = useMemo(selectors.content.sectionTree, [])
  const sectionTree = useSelector(state => sectionTreeSelector(state, section))
  const routeMap = useSelector(selectors.nocode.routeMap)
  const items = sectionTree ? sectionTree.children : DEFAULT_ARRAY
  const storePathToItem = useSelector(selectors.content.routeItemPath)
  const showUI = useSelector(selectors.ui.showUI)
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

  const content = useMemo(() => {
    if(items.length <= 0) return null
    return (
      <TreeItems
        classes={ classes }
        renderers={ renderers }
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

  const editor = (
    <Suspense>
      <SectionEditor
        id={ section }
        tiny
        filter={ parentFilter }
        location={ `section:${section}` }
        structure="tree"
      />
    </Suspense>
  )

  const RootRenderer = renderers.root || defaultRenderers.root

  return (
    <RootRenderer
      content={ content }
      editor={ editor }
    />
  )
}

export default Tree