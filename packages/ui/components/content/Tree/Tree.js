import React, { lazy, useState, useEffect, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'

import selectors from '../../../store/selectors'
import Suspense from '../../system/Suspense'
import defaultRenderers from './renderers'
import TreePanel from './TreePanel'
import TreeItems from  './TreeItems'

const SectionEditor = lazy(() => import(/* webpackChunkName: "ui" */ './TreeSectionEditor'))

const DEFAULT_ARRAY = []

const Tree = ({
  renderers = {},
  section,
  onClick,
  classes,
  contentTop,
  ...props
}) => {

  const route = useSelector(selectors.router.route)
  const currentItemId = route.item
  const sectionTreeSelector = useMemo(selectors.content.sectionTree, [])
  const sectionTree = useSelector(state => sectionTreeSelector(state, section))
  const sectionPanelSelector = useMemo(selectors.section.panels, [])
  const panelData = useSelector(state => sectionPanelSelector(state, section))
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
        classes={ classes }
        {...props}
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
    onClick,
    classes
  ])

  const editor = showUI ? (
    <Suspense>
      <SectionEditor
        section={ section }
      />
    </Suspense>
  ) : null

  let panelTop = panelData.panelTop ? (
    <TreePanel
      layout={ panelData.panelTop }
      section={ section }
      panelName="panelTop"
      {...props}
    />
  ) : null

  const panelBottom = panelData.panelBottom ? (
    <TreePanel
      layout={ panelData.panelBottom }
      section={ section }
      panelName="panelBottom"
      {...props}
    />
  ) : null

  if(panelTop && contentTop) {
    panelTop = (
      <React.Fragment>
        { contentTop }
        { panelTop }
      </React.Fragment>
    )
  }
  else if(!panelTop && contentTop) {
    panelTop = contentTop
  }

  const RootRenderer = renderers.root || defaultRenderers.root

  return (
    <RootRenderer
      panelTop={ panelTop }
      content={ content }
      editor={ editor }
      panelBottom={ panelBottom }
      classes={ classes }
      {...props}
    />
  )
}

export default Tree