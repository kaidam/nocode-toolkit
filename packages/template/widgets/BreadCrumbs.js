import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import Link from '../components/widgets/Link'

import contentSelectors from '../store/selectors/content'

const Render = ({
  
} = {}) => {

  const pathToItem = useSelector(contentSelectors.routeAncestors)
  const breadcrumbs = useMemo(() => {
    const useItems = pathToItem.filter(item => item.route.location == 'singleton:home' ? false : true)
    const hasHome = useItems.find(item => item.route.path == '/')

    const base = hasHome ? [] : [{
      title: 'Home',
      path: '/',
      name: 'root',
      isLink: true,
    }]

    return base
      .concat(
        useItems
          .filter(item => item.node)
          .map((item, i) => {
            if(!item.node) return null

            return {
              title: item.node.name.replace(/^\w/, st => st.toUpperCase()),
              path: item.route.path,
              name: item.route.name,
              isLink: i < useItems.length - 1,
            }
          })
      )
      .filter(i => i)
  }, [
    pathToItem,
  ])

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
  Render,
}
