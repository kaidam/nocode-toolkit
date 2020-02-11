import { useSelector } from 'react-redux'
import selectors from '../../store/selectors'

const useShowUI = () => {
  const showUI = useSelector(selectors.ui.showUI)
  return showUI
}

export default useShowUI