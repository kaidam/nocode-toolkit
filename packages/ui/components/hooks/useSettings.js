import { useSelector } from 'react-redux'
import selectors from '../../store/selectors'

const useSettings = () => {
  const settings = useSelector(selectors.ui.settings)
  const settingsData = settings.data || {}
  return settingsData
}

export default useSettings