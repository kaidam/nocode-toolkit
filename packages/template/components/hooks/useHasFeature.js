import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import websiteSelectors from '../../store/selectors/website'

const useHasFeature = (name) => {
  const features = useSelector(websiteSelectors.websiteFeatures)
  return process.env.NODE_ENV == 'development' || features[name]
}

export default useHasFeature