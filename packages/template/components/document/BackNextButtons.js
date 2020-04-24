import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Link from '../widgets/Link'

import contentSelectors from '../../store/selectors/content'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    paddingTop: theme.spacing(2),
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
}))

const BackNextButtons = ({
  node,
}) => {

  const classes = useStyles()
  const treeSelector = useMemo(contentSelectors.sectionTree, [])
  const baseLocation = useSelector(contentSelectors.routeBaseLocation)
  const [ type, id ] = (baseLocation || '').split(':')
  const tree = useSelector(state => {
    return type == 'section' ?
      treeSelector(state, id) :
      []
  })

  const itemMap = useMemo(() => {
    const map = {}
    const addChildrenToList = (children) => {
      children
        .forEach(item => {
          map[item.id] = item
          if(item.children) addChildrenToList(item.children)
        })
    }
    addChildrenToList(tree || [])
    return map
  }, [
    tree,
  ])

  const sectionIds = useMemo(() => {
    const list = []
    const addChildrenToList = (children) => {
      children
        .forEach(item => {
          list.push(item.id)
          if(item.children) addChildrenToList(item.children)
        })
    }
    addChildrenToList(tree || [])
    return list
  }, [
    tree,
  ])
  
  const currentIndex = sectionIds.indexOf(node.id)

  const prevId = sectionIds[currentIndex - 1]
  const nextId = sectionIds[currentIndex + 1]

  let prevLink = null
  let nextLink = null

  if(prevId && itemMap[prevId] && itemMap[prevId].route) {
    const prevItem = itemMap[prevId]
    prevLink = (
      <Link
        name={ prevItem.route.name }
        path={ prevItem.route.path }
      >
        &lt;- { prevItem.name }
      </Link>
    )
  }

  if(nextId && itemMap[nextId] && itemMap[nextId].route) {
    const nextItem = itemMap[nextId]
    nextLink = (
      <Link
        name={ nextItem.route.name }
        path={ nextItem.route.path }
      >
        { nextItem.name } -&gt;
      </Link>
    )
  }

  return (
    <div className={ classes.root }>
      <div className={ classes.left }>
        { prevLink }
      </div>
      <div className={ classes.center }>
        
      </div>
      <div className={ classes.right }>
        { nextLink }
      </div>
    </div>
  )
}

export default BackNextButtons