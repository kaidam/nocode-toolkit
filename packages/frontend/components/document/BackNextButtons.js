import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import Link from '@nocode-toolkit/website/Link'
import selectors from '../../store/selectors'

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  left: {
    flexGrow: 0,
    textAlign: 'left',
  },
  center: {
    flexGrow: 1,
  },
  right: {
    flexGrow: 0,
    textAlign: 'right',
  }
}

const BackNextButtons = ({
  content,
}) => {

  const pathToItem = useSelector(selectors.content.routeItems)
  const itemData = useSelector(selectors.document.data)
  const routeMap = useSelector(selectors.nocode.routeMap)
  const contentAll = useSelector(selectors.content.contentAll)
  const sectionPageListSelector = useMemo(selectors.content.sectionPageList, [])
  const rootItem = pathToItem[0] || itemData.item
  const sectionId = rootItem && rootItem.location ? rootItem.location.id : 'sidebar'
  const sectionPageList = useSelector(state => sectionPageListSelector(state, sectionId))

  if(!rootItem) return null

  const currentIndex = sectionPageList.indexOf(itemData.item.id)

  const prevId = sectionPageList[currentIndex - 1]
  const nextId = sectionPageList[currentIndex + 1]

  let prevLink = null
  let nextLink = null

  if(prevId && contentAll[prevId] && routeMap[prevId]) {
    const prevItem = contentAll[prevId]
    const prevRoute = routeMap[prevId]

    prevLink = (
      <Link
        name={ prevRoute.name }
        path={ prevRoute.path }
      >
        &lt;- { prevItem.data.name }
      </Link>
    )
  }

  if(nextId && contentAll[nextId] && routeMap[nextId]) {
    const nextItem = contentAll[nextId]
    const nextRoute = routeMap[nextId]

    nextLink = (
      <Link
        name={ nextRoute.name }
        path={ nextRoute.path }
      >
        { nextItem.data.name } -&gt;
      </Link>
    )
  }

  return (
    <div style={ styles.root }>
      <div style={ styles.left }>
        { prevLink }
      </div>
      <div style={ styles.center }>
        
      </div>
      <div style={ styles.right }>
        { nextLink }
      </div>
    </div>
  )
}

export default BackNextButtons