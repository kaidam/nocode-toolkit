import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import Link from '@nocode-toolkit/website/Link'
import selectors from '../../store/selectors'

const BreadCrumbs = ({
  content,
}) => {

  const pathToItem = useSelector(selectors.content.routeItems)
  const routeMap = useSelector(selectors.nocode.routeMap)

  const breadcrumbs = useMemo(() => {
    return [{
      title: 'Home',
      path: '/',
      name: 'root',
    }]
      .concat(pathToItem.map(item => {
        const route = routeMap[item.id]
        return {
          title: item.data.name,
          path: route.path,
          name: route.name,
        }
      }))
  }, [
    pathToItem,
    routeMap,
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