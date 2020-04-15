import { useMemo, useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import uiActions from '../../store/modules/ui'
import uiSelectors from '../../store/selectors/ui'
import contentSelectors from '../../store/selectors/content'
import routerSelectors from '../../store/selectors/router'

const useSectionTree = ({
  section,
}) => {
  const dispatch = useDispatch()

  const [ openFolders, setOpenFolders ] = useState({})

  const onToggleFolder = useCallback((id) => {
    setOpenFolders(Object.assign({}, openFolders, {
      [id]: openFolders[id] ? false : true,
    }))
  }, [
    openFolders,
  ])

  const treeSelector = useMemo(contentSelectors.sectionTree, [])
  const tree = useSelector(state => treeSelector(state, section))
  const ancestors = useSelector(routerSelectors.ancestorsWithRoute)
  const scrollToCurrentPage = useSelector(uiSelectors.scrollToCurrentPage)

  // this is used when a tree item is actually clicked
  // because they clicked it - we assume that they can see
  // that tree item and don't want to scroll to it
  // wait for a render and then re-enable it
  const onDisableScrollToCurrentPage = useCallback(() => {
    dispatch(uiActions.setScrollToCurrentPage(false))
    setTimeout(() => {
      dispatch(uiActions.setScrollToCurrentPage(true))
    }, 10)
  }, [])

  const list = useMemo(() => {
    const items = []
    const addItem = ({
      node,
      depth = 0,
    }) => {
      const open = openFolders[node.id]

      items.push({
        id: node.id,
        node,
        depth,
        open,
        route: node.route,
        currentPage: node.currentPage,
      })

      // if the folder is open, include it's children
      // adding one to the depth so we can render nested items
      if(open) {
        node.children.forEach(child => {
          addItem({
            node: child,
            depth: depth + 1,
          })
        })
      }
    }

    // add the top level section items to the tree
    tree.forEach(node => addItem({
      node,
    }))
    return items
  }, [
    tree,
    openFolders,
  ])

  // when the route changes - open the ancestor folders
  useEffect(() => {
    setOpenFolders(ancestors.reduce((all, id) => {
      all[id] = true
      return all
    }, {}))
  }, [
    ancestors,
  ])

  return {
    tree,
    list,
    scrollToCurrentPage,
    onToggleFolder,
    onDisableScrollToCurrentPage,
  }
}

export default useSectionTree