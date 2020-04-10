import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import Link from '../widgets/Link'

import contentSelectors from '../../store/selectors/content'

const BreadCrumbs = ({

} = {}) => {

  const pathToItem = useSelector(contentSelectors.routeAncestors)
  const breadcrumbs = useMemo(() => {
    const useItems = pathToItem.filter(item => item.route.location == 'singleton:home' ? false : true)
    return [{
      title: 'Home',
      path: '/',
      name: 'root',
    }]
      .concat(useItems.map(item => {
        return {
          title: item.node.name,
          path: item.route.path,
          name: item.route.name,
        }
      }))
      .filter(i => i)
  }, [
    pathToItem,
  ])

  return (
    <div>
      {
        breadcrumbs.map((breadcrumb, i) => {
          const link = (
            <Link
              path={ breadcrumb.path }
              name={ breadcrumb.name }
            >
              { breadcrumb.title }
            </Link>
          )

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

export default BreadCrumbs