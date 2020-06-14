import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import contentSelectors from '../../store/selectors/content'

const useSectionSelector = ({
  section,
}) => {
  const sectionSelector = useMemo(contentSelectors.section, [])
  const sectionData = useSelector(state => sectionSelector(state, section))
  return sectionData || {}
}

export default useSectionSelector