import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Actions from '../../utils/actions'
import contentActions from '../../store/modules/content'

const DocumentReloadTrigger = ({
  node,
}) => {
  const actions = Actions(useDispatch(), {
    reloadExternalContent: contentActions.reloadExternalContent,
  })
  useEffect(() => {
    function handleWindowFocus() {
      if(node.driver && node.id) {
        actions.reloadExternalContent({
          driver: node.driver,
          id: node.id,
        })
      }
    }
    window.addEventListener('focus', handleWindowFocus)
    return function cleanup() {
      window.removeEventListener('focus', handleWindowFocus)
    }
  }, [
    node,
  ])
  return null
}

export default DocumentReloadTrigger
