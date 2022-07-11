import { useSelector } from 'react-redux'
import settingsSelectors from '../../store/selectors/settings'


const LINKS = [
  {icon: 'facebook', key: 'facebook'},
  {icon: 'twitter', key: 'twitter'},
  {icon: 'linkedin', key: 'linkedin'},
  {icon: 'youtube', key: 'youtube'},
  {icon: 'pinterest', key: 'pinterest'},
  {icon: 'instagram', key: 'instagram'},
]

const useSocialLinks = () => {
  const settings = useSelector(settingsSelectors.settings)

  const data = settings.social_links || {}

  return LINKS
    .filter(item => data[item.key] ? true : false)
    .map((item, i) => {
      const value = data[item.key]
      const url = value.match(/^https?:\/\//i) ?
        value :
        `http://${value}`
      return Object.assign({}, item, {
        url,
      })
    })
}

export default useSocialLinks