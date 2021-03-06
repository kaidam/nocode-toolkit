import { useMemo, useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import uiActions from '../../store/modules/ui'
import uiSelectors from '../../store/selectors/ui'
import contentSelectors from '../../store/selectors/content'
import nocodeSelectors from '../../store/selectors/nocode'

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

  // console.log(section)
  // console.log(JSON.stringify(openFolders, null, 4))

  const treeSelector = useMemo(contentSelectors.sectionTree, [])
  const tree = useSelector(state => treeSelector(state, section))
  const ancestors = useSelector(nocodeSelectors.ancestorsWithRoute)
  const scrollToCurrentPage = useSelector(uiSelectors.scrollToCurrentPage)

  const childrenMap = useMemo(() => {
    const map = {}
    const processItem = (parentId, nodes) => {
      if(!nodes) return
      map[parentId] = nodes.map(node => node.id)
      nodes.forEach(node => {
        processItem(node.id, node.children)
      })
    }
    processItem(`section:${section}`, tree)
    return map
  }, [
    tree,
    section,
  ])

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
    childrenMap,
    openFolders,
    scrollToCurrentPage,
    onToggleFolder,
    onDisableScrollToCurrentPage,
  }
}

export default useSectionTree