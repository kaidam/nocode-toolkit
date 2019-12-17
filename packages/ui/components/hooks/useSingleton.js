import { useSelector } from 'react-redux'
import selectors from '../../store/selectors'

const useSingleton = (id) => {
  const allContent = useSelector(selectors.content.contentAll)
  const item = allContent[id] || {}
  const itemData = item.data || {}
  return itemData
}

export default useSingleton