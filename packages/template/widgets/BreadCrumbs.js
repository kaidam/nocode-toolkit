import React from 'react'
import { useSelector } from 'react-redux'
import Link from '../components/widgets/Link'

import contentSelectors from '../store/selectors/content'
import icons from '../icons'

const Render = ({
  
} = {}) => {

  const breadcrumbs = useSelector(contentSelectors.breadcrumbs)

  if(breadcrumbs.length <= 0) return null
  
  return (
    <div>
      {
        breadcrumbs.map((breadcrumb, i) => {
          const link = breadcrumb.isLink ? (
            <Link
              path={ breadcrumb.path }
              name={ breadcrumb.name }
            >
              { breadcrumb.title }
            </Link>
          ) : breadcrumb.title

          const seperator = i < breadcrumbs.length - 1 ?
            ' / ' : ''

          return (
            <React.Fragment key={ i }>
              { link }
              { seperator }
            </React.Fragment>
          )
        })
      }
    </div>
  )
}

export default {
  id: 'breadcrumbs',
  title: 'Breadcrumbs',
  description: 'Links to parent folders',
  editable: false,
  locations: ['document'],
  group: 'Navigation',
  Render,
  icon: icons.breadcrumbs,
}
